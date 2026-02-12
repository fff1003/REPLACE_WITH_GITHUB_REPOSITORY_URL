import { describe, expect, it } from 'vitest';
import { parseHomepage, parseTopics } from '@/lib/scrape/parser';
import fs from 'node:fs';

describe('scrape parser', () => {
  it('parses homepage posts', () => {
    const html = fs.readFileSync('tests/fixtures/homepage.html', 'utf8');
    const posts = parseHomepage(html, 'https://religiousliberty.tv/');
    expect(posts[0].slug).toBe('sample-post');
    expect(posts[0].dateDisplay).toContain('February');
  });

  it('parses topics list', () => {
    const html = fs.readFileSync('tests/fixtures/topics.html', 'utf8');
    const topics = parseTopics(html);
    expect(topics.length).toBe(2);
    expect(topics[0].count).toBe(12);
  });
});
