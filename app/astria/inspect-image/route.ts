import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function POST(request: NextRequest) {
  // Auth check: only authenticated users can call image inspection
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