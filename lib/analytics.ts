import crypto from 'node:crypto';
import { prisma } from './db/client';

export function hashUa(ua?: string | null) {
  if (!ua) return null;
  return crypto.createHash('sha256').update(ua).digest('hex');
}

export async function recordClick(input: { shortId: string; destination: string; referrer?: string | null; userAgent?: string | null }) {
  return prisma.clickEvent.create({
    data: {
      shortId: input.shortId,
      destination: input.destination,
      referrer: input.referrer || null,
      userAgentHash: hashUa(input.userAgent)
    }
  });
}
