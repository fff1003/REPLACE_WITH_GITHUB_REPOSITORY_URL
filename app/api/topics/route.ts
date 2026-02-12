import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';

export async function GET() {
  const topics = await prisma.topic.findMany();
  return NextResponse.json({ topics });
}
