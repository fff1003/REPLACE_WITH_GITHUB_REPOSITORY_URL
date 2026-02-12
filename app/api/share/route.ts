import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { nanoid } from 'nanoid';
import { env } from '@/lib/utils/env';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const post = await prisma.post.findUnique({ where: { id: Number(body.postId) } });
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const shortId = nanoid(8);
  const utmUrl = `${post.canonicalUrl}${post.canonicalUrl.includes('?') ? '&' : '?'}utm_source=rl_reader&utm_medium=share&utm_campaign=organic&utm_content=${shortId}`;
  await prisma.shareLink.create({ data: { shortId, postId: post.id, destination: post.slug, utmUrl } });

  return NextResponse.json({ shortId, shortUrl: `${env.baseUrl}/r/${shortId}`, utmUrl });
}
