import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { prisma } from '@/lib/db/client';
import { sendConfirmEmail } from '@/lib/email/send';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const token = nanoid(24);
  const sub = await prisma.subscriber.upsert({
    where: { email: String(body.email) },
    update: { confirmToken: token, frequency: String(body.frequency || 'daily'), wantsWebPush: !!body.wantsWebPush },
    create: {
      email: String(body.email),
      confirmToken: token,
      frequency: String(body.frequency || 'daily'),
      wantsWebPush: !!body.wantsWebPush
    }
  });

  try {
    await sendConfirmEmail(sub.email, token);
  } catch {
    // no hard fail in local if smtp unavailable
  }

  return NextResponse.json({ message: 'Check your email to confirm subscription.' });
}
