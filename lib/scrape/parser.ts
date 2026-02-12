import * as cheerio from 'cheerio';
import { parse } from 'date-fns';
import type { ScrapedPost, ScrapedTopic } from './types';

const MONTH_FORMAT = 'MMMM d, yyyy';

export function slugFromUrl(url: string): string {
  const u = new URL(url, 'https://religiousliberty.tv');
  return u.pathname.split('/').filter(Boolean).pop() || 'unknown';
}

export function parseHomepage(html: string, sourcePage: string): ScrapedPost[] {
  const $ = cheerio.load(html);
  const out: ScrapedPost[] = [];

  $('article, .post, .latest-posts article').each((_, el) => {
    const link = $(el).find('h2 a, h3 a, .entry-title a').first();
    const title = link.text().trim();
    const href = link.attr('href');
    if (!title || !href) return;
    const dateDisplay = $(el).find('time, .posted-on, .entry-date').first().text().trim() || undefined;
    const excerpt = $(el).find('p').first().text().trim() || undefined;
    const parsed = dateDisplay ? parse(dateDisplay, MONTH_FORMAT, new Date()) : undefined;
    out.push({
      title,
      href,
      slug: slugFromUrl(href),
      dateDisplay,
      dateISO: parsed && !Number.isNaN(parsed.getTime()) ? parsed.toISOString() : undefined,
      excerpt,
      sourcePage,
      topics: []
    });
  });

  return dedupePosts(out);
}

export function parseTopics(html: string): ScrapedTopic[] {
  const $ = cheerio.load(html);
  const topics: ScrapedTopic[] = [];
  $('a').each((_, el) => {
    const href = $(el).attr('href') || '';
    const text = $(el).text().trim();
    if (!text || !href.includes('/category/')) return;
    const countMatch = text.match(/\((\d+)\)/);
    const name = text.replace(/\(\d+\)/, '').trim();
    topics.push({ name, url: href, count: countMatch ? Number(countMatch[1]) : undefined });
  });
  return Array.from(new Map(topics.map((t) => [t.url, t])).values());
}

function dedupePosts(posts: ScrapedPost[]) {
  return Array.from(new Map(posts.map((p) => [p.slug, p])).values());
}
