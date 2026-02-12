import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') || '';
  const posts = await prisma.post.findMany({ where: { OR: [{ title: { contains: q } }, { excerpt: { contains: q } }] }, take: 50 });
  return NextResponse.json({ posts });
}
