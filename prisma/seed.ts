import { prisma } from '../lib/db/client';

async function main() {
  const fixtures = [
    {
      title: 'Religious Liberty and Public Witness',
      slug: 'religious-liberty-and-public-witness',
      canonicalUrl: 'https://religiousliberty.tv/religious-liberty-and-public-witness/',
      dateDisplay: 'February 6, 2026',
      excerpt: 'How faith communities can advance freedom in public life.',
      sourcePage: 'https://religiousliberty.tv/',
      topics: 'Current Events'
    },
    {
      title: 'In the News: Supreme Court Update',
      slug: 'supreme-court-update',
      canonicalUrl: 'https://religiousliberty.tv/supreme-court-update/',
      dateDisplay: 'February 1, 2026',
      excerpt: 'Latest developments in legal protections for conscience rights.',
      sourcePage: 'https://religiousliberty.tv/category/in-the-news/',
      topics: 'In the News'
    }
  ];

  for (const p of fixtures) {
    await prisma.post.upsert({
      where: { slug: p.slug },
      update: { ...p, lastSeenAt: new Date() },
      create: { ...p, lastSeenAt: new Date() }
    });
  }

  await prisma.topic.upsert({ where: { name: 'Current Events' }, update: { url: 'https://religiousliberty.tv/category/current-events/' }, create: { name: 'Current Events', url: 'https://religiousliberty.tv/category/current-events/' } });
  await prisma.topic.upsert({ where: { name: 'In the News' }, update: { url: 'https://religiousliberty.tv/category/in-the-news/' }, create: { name: 'In the News', url: 'https://religiousliberty.tv/category/in-the-news/' } });
}

main().finally(() => prisma.$disconnect());
