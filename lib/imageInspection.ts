import axios from 'axios';



export interface ImageInspectionResult {

  age?: string;

  blurry: boolean;

  ethnicity?: string;

  eye_color?: string;

  facial_hair?: string;

  full_body_image_or_longshot: boolean;

  funny_face: boolean;

  glasses?: string;

  hair_color?: string;

  hair_length?: string;

  hair_style?: string;

  includes_multiple_people: boolean;

  is_bald?: string;

  name?: string;

  selfie: boolean;

  wearing_hat: boolean;

  wearing_sunglasses: boolean;

}



export type InspectImageResponse = {

  result: ImageInspectionResult;

  /** False when Astria did not return a real inspection (network/auth/API error). */

  verified: boolean;

};



function coerceBool(value: unknown): boolean {

  return value === true || value === 'true' || value === 1 || value === '1';

}



/** Normalize Astria JSON — API booleans may arrive as strings in some paths. */

export function normalizeInspectionResult(data: unknown): ImageInspectionResult {

  const raw =

    data && typeof data === 'object'

      ? (data as Record<string, unknown>)

      : {};



  return {

    age: typeof raw.age === 'string' ? raw.age : undefined,

    ethnicity: typeof raw.ethnicity === 'string' ? raw.ethnicity : undefined,

    eye_color: typeof raw.eye_color === 'string' ? raw.eye_color : undefined,

    facial_hair: typeof raw.facial_hair === 'string' ? raw.facial_hair : undefined,

    glasses: typeof raw.glasses === 'string' ? raw.glasses : undefined,

    hair_color: typeof raw.hair_color === 'string' ? raw.hair_color : undefined,

    hair_length: typeof raw.hair_length === 'string' ? raw.hair_length : undefined,

    hair_style: typeof raw.hair_style === 'string' ? raw.hair_style : undefined,

    is_bald: typeof raw.is_bald === 'string' ? raw.is_bald : undefined,

    name: typeof raw.name === 'string' ? raw.name : undefined,

    selfie: coerceBool(raw.selfie),

    blurry: coerceBool(raw.blurry),

    includes_multiple_people: coerceBool(raw.includes_multiple_people),

    full_body_image_or_longshot: coerceBool(raw.full_body_image_or_longshot),

    funny_face: coerceBool(raw.funny_face),

    wearing_hat: coerceBool(raw.wearing_hat),

    wearing_sunglasses: coerceBool(raw.wearing_sunglasses),

  };

}



export async function inspectImage(

  file: File,

  type: string

): Promise<InspectImageResponse> {

  try {

    const formData = new FormData();

    formData.append('name', type);

    formData.append('file', await resizeImage(file));



    const response = await axios.post('/astria/inspect-image', formData, {

      headers: {

        'Content-Type': 'multipart/form-data',

      },

      timeout: 25_000,

      validateStatus: (status) => status < 500,

    });



    if (response.status === 401) {

      return { result: normalizeInspectionResult({}), verified: false };

    }



    if (response.status !== 200) {

      if (process.env.NODE_ENV === 'development') {

        console.warn('Image inspection HTTP error:', response.status, response.data);

      }

      const body = response.data as ImageInspectionResult & { verified?: boolean };

      return {
        result: normalizeInspectionResult(body),
        verified: body.verified === true,
      };

    }



    const body = response.data as ImageInspectionResult & { verified?: boolean };

    const result = normalizeInspectionResult(body);

    const verified =
      typeof body.verified === 'boolean'
        ? body.verified
        : typeof result.name === 'string' &&
          result.name.length > 0 &&
          result.name !== 'NONE';



    return { result, verified };

  } catch (error) {

    if (process.env.NODE_ENV === 'development') {

      console.warn('Image inspection failed:', error);

    }

    return { result: normalizeInspectionResult({}), verified: false };

  }

}



async function resizeImage(file: File): Promise<File> {

  return new Promise((resolve, reject) => {

    const img = new Image();

    const reader = new FileReader();

    const timeout = setTimeout(() => {

      reject(new Error('Image resize timed out'));

    }, 15_000);



    const finish = (fn: () => void) => {

      clearTimeout(timeout);

      fn();

    };



    reader.onload = (e) => {

      img.onload = () => {

        const canvas = document.createElement('canvas');

        const maxDimension = 512;

        let width = img.width;

        let height = img.height;



        if (width <= maxDimension && height <= maxDimension) {

          finish(() => resolve(file));

          return;

        }



        if (width > height) {

          height = Math.round((height * maxDimension) / width);

          width = maxDimension;

        } else {

          width = Math.round((width * maxDimension) / height);

          height = maxDimension;

        }



        canvas.width = width;

        canvas.height = height;

        const ctx = canvas.getContext('2d');

        ctx?.drawImage(img, 0, 0, width, height);



        canvas.toBlob(

          (blob) => {

            if (!blob) {

              finish(() => reject(new Error('Canvas to Blob conversion failed')));

              return;

            }

            finish(() =>

              resolve(new File([blob], file.name, { type: file.type || blob.type }))

            );

          },

          file.type || 'image/jpeg',

          0.9

        );

      };



      img.onerror = () =>

        finish(() => reject(new Error('Failed to load image for resize')));

      if (e.target) {

        img.src = e.target.result as string;

      } else {

        finish(() => reject(new Error('FileReader event target is null')));

      }

    };



    reader.onerror = () => finish(() => reject(new Error('FileReader failed')));

    reader.readAsDataURL(file);

  });

}



export function aggregateCharacteristics(results: ImageInspectionResult[]): Record<string, string> {

  const aggregated: Record<string, string[]> = {};

  

  results.forEach((result) => {

    Object.entries(result).forEach(([key, value]) => {

      if (typeof value === 'string') {

        if (aggregated[key]) {

          aggregated[key].push(value);

        } else {

          aggregated[key] = [value];

        }

      }

    });

  });



  const commonValues: Record<string, string> = {};

  Object.entries(aggregated).forEach(([key, values]) => {

    const mostCommonValue = values.sort((a, b) => 

      values.filter(v => v === a).length - values.filter(v => v === b).length

    ).pop();

    if (mostCommonValue) {

      commonValues[key] = mostCommonValue;

    }

  });



  return commonValues;

}

