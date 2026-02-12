import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) return NextResponse.json({ error: 'missing token' }, { status: 400 });

  try {
    await prisma.subscriber.update({ where: { confirmToken: token }, data: { confirmedAt: new Date() } });
    return NextResponse.redirect(new URL('/?confirmed=1', req.url));
  } catch {
    return NextResponse.json({ error: 'invalid token' }, { status: 400 });
  }
}
