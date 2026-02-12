import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Scheduler runs in-process using node-cron; see logs.' });
}
