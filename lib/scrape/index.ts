import { prisma } from '@/lib/db/client';
import { fetchHtml, canScrapeNow, shouldUseCache } from './fetcher';
import { parseHomepage, parseTopics } from './parser';
import { isAllowed } from './robots';

const HOME = 'https://religiousliberty.tv/';
const TOPIC_INDEX = 'https://religiousliberty.tv/search-religiousliberty-tv/';
const FALLBACK_CATEGORIES = [
  'https://religiousliberty.tv/category/current-events/',
  'https://religiousliberty.tv/category/in-the-news/',
  'https://religiousliberty.tv/category/multimedia/video/'
];

export async function runScrape() {
  if (!(await canScrapeNow()) || (await shouldUseCache())) {
    return { status: 'cached' as const };
  }

  const pages = [HOME, TOPIC_INDEX, ...FALLBACK_CATEGORIES];
  const htmlByPage = new Map<string, string>();

  for (const page of pages) {
    if (!(await isAllowed(page))) continue;
    const html = await fetchHtml(page);
    if (html) htmlByPage.set(page, html);
  }

  const posts = [
    ...parseHomepage(htmlByPage.get(HOME) || '', HOME),
    ...FALLBACK_CATEGORIES.flatMap((c) => parseHomepage(htmlByPage.get(c) || '', c))
  ];

  for (const p of posts) {
    await prisma.post.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        canonicalUrl: p.href,
        dateDisplay: p.dateDisplay,
        dateISO: p.dateISO ? new Date(p.dateISO) : null,
        excerpt: p.excerpt,
        sourcePage: p.sourcePage,
        topics: p.topics.join(','),
        lastSeenAt: new Date()
      },
      create: {
        title: p.title,
        slug: p.slug,
        canonicalUrl: p.href,
        dateDisplay: p.dateDisplay,
        dateISO: p.dateISO ? new Date(p.dateISO) : null,
        excerpt: p.excerpt,
        sourcePage: p.sourcePage,
        topics: p.topics.join(','),
        lastSeenAt: new Date()
      }
    });
  }

  const topicHtml = htmlByPage.get(TOPIC_INDEX);
  if (topicHtml) {
    const topics = parseTopics(topicHtml);
    for (const t of topics) {
      await prisma.topic.upsert({
        where: { name: t.name },
        update: { url: t.url, postCount: t.count },
        create: { name: t.name, url: t.url, postCount: t.count }
      });
    }
  }

  return { status: 'ok' as const, postCount: posts.length };
}
