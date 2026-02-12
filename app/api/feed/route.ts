import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') || undefined;
  const posts = await prisma.post.findMany({
    where: q ? { OR: [{ title: { contains: q } }, { excerpt: { contains: q } }] } : undefined,
    orderBy: [{ dateISO: 'desc' }, { lastSeenAt: 'desc' }],
    take: 100
  });
  return NextResponse.json({ posts });
}
