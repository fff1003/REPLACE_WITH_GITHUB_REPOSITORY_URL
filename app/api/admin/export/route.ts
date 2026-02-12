import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { stringify } from 'csv-stringify/sync';
import { env } from '@/lib/utils/env';

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get('password') !== env.adminPassword) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const clicks = await prisma.clickEvent.findMany();
  const csv = stringify(clicks.map((c) => ({
    timestamp: c.createdAt.toISOString(),
    shortid: c.shortId,
    referrer: c.referrer || '',
    userAgentHash: c.userAgentHash || '',
    destination: c.destination
  })), { header: true });

  return new NextResponse(csv, { headers: { 'content-type': 'text/csv' } });
}
