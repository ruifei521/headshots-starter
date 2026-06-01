import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

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
    // Add timeout to prevent hanging — Astria inspect should be fast
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch('https://api.astria.ai/images/inspect', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ASTRIA_API_KEY}`,
      },
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      // Astria returned error status — return default pass
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
