import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();

  // If no Astria API key, return a default "pass" result so uploads still work
  if (!process.env.ASTRIA_API_KEY) {
    return NextResponse.json({
      selfie: false,
      blurry: false,
      includes_multiple_people: false,
      full_body_image_or_longshot: false,
      funny_face: false,
      wearing_hat: false,
      wearing_sunglasses: false,
    });
  }

  try {
    const response = await fetch('https://api.astria.ai/images/inspect', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ASTRIA_API_KEY}`,
      },
      body: formData,
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    // Return default pass result on error so upload flow is not blocked
    return NextResponse.json({
      selfie: false,
      blurry: false,
      includes_multiple_people: false,
      full_body_image_or_longshot: false,
      funny_face: false,
      wearing_hat: false,
      wearing_sunglasses: false,
    });
  }
}