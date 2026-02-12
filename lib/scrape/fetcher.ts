import { prisma } from '@/lib/db/client';

const MIN_INTERVAL_MS = 15 * 60 * 1000;
const REQUEST_DELAY_MS = 1000;

let lastRequestAt = 0;

async function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function canScrapeNow() {
  const state = await prisma.scrapeState.findUnique({ where: { id: 1 } });
  if (!state?.nextAllowedAt) return true;
  return state.nextAllowedAt.getTime() <= Date.now();
}

export async function shouldUseCache() {
  const state = await prisma.scrapeState.findUnique({ where: { id: 1 } });
  return !!state?.lastRunAt && Date.now() - state.lastRunAt.getTime() < MIN_INTERVAL_MS;
}

export async function fetchHtml(url: string): Promise<string | null> {
  const now = Date.now();
  if (now - lastRequestAt < REQUEST_DELAY_MS) {
    await delay(REQUEST_DELAY_MS - (now - lastRequestAt));
  }

  lastRequestAt = Date.now();
  try {
    const res = await fetch(url, { headers: { 'user-agent': 'RLTV-Reader/1.0' } });
    if (res.status === 403 || res.status === 429) {
      await recordFailure(`Blocked by upstream (${res.status}) for ${url}`);
      return null;
    }
    if (!res.ok) {
      await recordFailure(`Fetch failed (${res.status}) for ${url}`);
      return null;
    }
    await recordSuccess('Fresh scrape succeeded');
    return res.text();
  } catch (error) {
    await recordFailure(`Network error for ${url}: ${(error as Error).message}`);
    return null;
  }
}

async function recordFailure(note: string) {
  const prev = await prisma.scrapeState.findUnique({ where: { id: 1 } });
  const failures = (prev?.failureCount || 0) + 1;
  const backoffMin = Math.min(2 ** failures, 240);
  await prisma.scrapeState.upsert({
    where: { id: 1 },
    update: { failureCount: failures, nextAllowedAt: new Date(Date.now() + backoffMin * 60_000), lastStatusNote: note },
    create: { id: 1, failureCount: failures, nextAllowedAt: new Date(Date.now() + backoffMin * 60_000), lastStatusNote: note }
  });
}

async function recordSuccess(note: string) {
  await prisma.scrapeState.upsert({
    where: { id: 1 },
    update: { failureCount: 0, lastRunAt: new Date(), nextAllowedAt: null, lastStatusNote: note },
    create: { id: 1, failureCount: 0, lastRunAt: new Date(), lastStatusNote: note }
  });
}
