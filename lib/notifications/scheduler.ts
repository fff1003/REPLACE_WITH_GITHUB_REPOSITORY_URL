import cron from 'node-cron';
import { prisma } from '@/lib/db/client';

let started = false;

export function startScheduler() {
  if (started) return;
  started = true;

  cron.schedule('0 * * * *', async () => {
    const latest = await prisma.post.findMany({ orderBy: { lastSeenAt: 'desc' }, take: 5 });
    const subscribers = await prisma.subscriber.findMany({ where: { confirmedAt: { not: null }, frequency: 'instant' } });
    console.log(`scheduler tick: ${subscribers.length} instant subscribers, ${latest.length} posts in digest`);
  });

  cron.schedule('0 9 * * *', async () => {
    const subscribers = await prisma.subscriber.findMany({ where: { confirmedAt: { not: null }, frequency: 'daily' } });
    console.log(`daily digest tick: ${subscribers.length} recipients`);
  });
}
