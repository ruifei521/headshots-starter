import { NextRequest, NextResponse } from 'next/server';

import { createServerClient } from '@supabase/ssr';

import {
  normalizeInspectionResult,
  type ImageInspectionResult,
} from '@/lib/imageInspection';



function inspectionPayload(
  result: ImageInspectionResult,
  verified: boolean,
  status = 200
) {
  return NextResponse.json({ ...result, verified }, { status });
}



export async function POST(request: NextRequest) {

  const supabase = createServerClient(

    process.env.NEXT_PUBLIC_SUPABASE_URL!,

    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,

    {

      cookies: {

        getAll() { return request.cookies.getAll(); },

        setAll() {},

      },

    }

  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {

    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  }



  const incoming = await request.formData();

  const name = incoming.get('name');

  const file = incoming.get('file');



  if (!name || !(file instanceof Blob)) {

    return NextResponse.json({ error: 'Missing name or file' }, { status: 400 });

  }



  if (!process.env.ASTRIA_API_KEY) {

    console.warn('[inspect-image] ASTRIA_API_KEY is not configured');

    return inspectionPayload(normalizeInspectionResult({}), false, 503);

  }



  const astriaForm = new FormData();

  astriaForm.append('name', String(name));

  astriaForm.append('file', file, file instanceof File ? file.name : 'photo.jpg');



  try {

    const response = await fetch('https://api.astria.ai/images/inspect', {

      method: 'POST',

      headers: {

        Authorization: `Bearer ${process.env.ASTRIA_API_KEY}`,

      },

      body: astriaForm,

      signal: AbortSignal.timeout(25_000),

    });



    if (!response.ok) {

      const body = await response.text().catch(() => '');

      console.error('[inspect-image] Astria API error:', response.status, body.slice(0, 300));

      return inspectionPayload(normalizeInspectionResult({}), false, 502);

    }



    const data = await response.json();

    const result = normalizeInspectionResult(data);

    const verified =
      typeof result.name === 'string' &&
      result.name.length > 0 &&
      result.name !== 'NONE';

    return inspectionPayload(result, verified);

  } catch (error) {

    console.error('[inspect-image] Request failed:', error);

    return inspectionPayload(normalizeInspectionResult({}), false, 502);

  }

}
