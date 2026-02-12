import { NextResponse } from 'next/server';
import { runScrape } from '@/lib/scrape';

export async function POST() {
  const result = await runScrape();
  return NextResponse.json(result);
}
