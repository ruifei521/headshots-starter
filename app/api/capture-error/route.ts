/**
 * TEMPORARY: Error capture endpoint for debugging the flashing error boundary.
 * Captures client-side errors with full details and writes to .next/error-capture.log
 * DELETE THIS FILE after the bug is resolved.
 */
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const logEntry = {
      timestamp: new Date().toISOString(),
      ...body,
    };

    const logDir = path.join(process.cwd(), '.next');
    const logFile = path.join(logDir, 'error-capture.log');

    const line = JSON.stringify(logEntry) + '\n';
    fs.appendFileSync(logFile, line);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const logFile = path.join(process.cwd(), '.next', 'error-capture.log');
    if (!fs.existsSync(logFile)) {
      return NextResponse.json({ errors: [] });
    }
    const content = fs.readFileSync(logFile, 'utf-8');
    const errors = content.trim().split('\n').filter(Boolean).map(JSON.parse);
    return NextResponse.json({ errors });
  } catch {
    return NextResponse.json({ errors: [], error: 'Failed to read log' });
  }
}
