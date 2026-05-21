import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.redirect(
    'https://console.cloud.google.com/apis/credentials/consent?project=929789267603'
  );
}
