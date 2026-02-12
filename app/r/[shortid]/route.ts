import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { recordClick } from '@/lib/analytics';

export async function GET(req: NextRequest, { params }: { params: { shortid: string } }) {
  const link = await prisma.shareLink.findUnique({ where: { shortId: params.shortid } });
  if (!link) return NextResponse.redirect('https://religiousliberty.tv', 302);

  await recordClick({
    shortId: link.shortId,
    destination: link.destination,
    referrer: req.headers.get('referer'),
    userAgent: req.headers.get('user-agent')
  });

  return NextResponse.redirect(link.utmUrl, 302);
}
