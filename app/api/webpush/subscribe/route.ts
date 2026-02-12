import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/utils/env';

export async function POST(req: NextRequest) {
  if (!env.enableWebPush) {
    return NextResponse.json({ message: 'Web push feature flag disabled' }, { status: 400 });
  }
  const body = await req.json();
  return NextResponse.json({ ok: true, saved: !!body });
}
