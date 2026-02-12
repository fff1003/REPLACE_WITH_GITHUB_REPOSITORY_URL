import { test, expect } from '@playwright/test';

test('homepage feed loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Latest from ReligiousLiberty.TV')).toBeVisible();
});

test('share link redirects', async ({ page, request }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Share' }).first().click();
  const copy = page.getByText('Copy link').first();
  await expect(copy).toBeVisible();

  const href = await page.locator('a', { hasText: 'Share to X' }).first().getAttribute('href');
  expect(href).toContain('http');

  const res = await request.post('/api/share', { data: { postId: 1 } });
  const data = await res.json();
  const redirect = await request.get(`/r/${data.shortId}`, { maxRedirects: 0 });
  expect([301, 302, 307]).toContain(redirect.status());
});

test('admin dashboard loads', async ({ page }) => {
  await page.goto('/admin?password=changeme');
  await expect(page.getByText('Admin Analytics')).toBeVisible();
});
