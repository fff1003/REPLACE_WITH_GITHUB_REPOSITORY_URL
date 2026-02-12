import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { env } from '@/lib/utils/env';

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get('password') !== env.adminPassword) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const topLinks = await prisma.shareLink.findMany({ include: { clicks: true }, take: 10 });
  const clicks = await prisma.clickEvent.findMany({ orderBy: { createdAt: 'asc' } });
  const perDay = clicks.reduce<Record<string, number>>((acc, c) => {
    const day = c.createdAt.toISOString().slice(0, 10);
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});

  return NextResponse.json({
    topLinks: topLinks.map((l) => ({ shortId: l.shortId, clicks: l.clicks.length, destination: l.destination })),
    clicksPerDay: perDay,
    conversionProxyLabel: 'Redirect clicks captured via short link'
  });
}
