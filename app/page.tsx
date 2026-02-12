import { prisma } from '@/lib/db/client';
import ShareButtons from './components/share-buttons';
import SubscriptionForm from './components/subscription-form';
import { runScrape } from '@/lib/scrape';

export default async function Home({ searchParams }: { searchParams: { q?: string; topic?: string; days?: string } }) {
  await runScrape();
  const days = Number(searchParams.days || 0);
  const since = days ? new Date(Date.now() - days * 24 * 3600 * 1000) : null;

  const posts = await prisma.post.findMany({
    where: {
      ...(searchParams.q ? { OR: [{ title: { contains: searchParams.q } }, { excerpt: { contains: searchParams.q } }] } : {}),
      ...(searchParams.topic ? { topics: { contains: searchParams.topic } } : {}),
      ...(since ? { OR: [{ dateISO: { gte: since } }, { lastSeenAt: { gte: since } }] } : {})
    },
    orderBy: [{ dateISO: 'desc' }, { lastSeenAt: 'desc' }],
    take: 50
  });
  const topics = await prisma.topic.findMany({ orderBy: { name: 'asc' } });
  const state = await prisma.scrapeState.findUnique({ where: { id: 1 } });

  return (
    <div className="space-y-6">
      <section className="flex flex-col sm:flex-row gap-3 sm:items-end">
        <form className="flex-1 grid sm:grid-cols-4 gap-2">
          <input name="q" placeholder="Search titles/excerpts" className="border rounded px-3 py-2 sm:col-span-2" defaultValue={searchParams.q} />
          <select name="topic" className="border rounded px-3 py-2" defaultValue={searchParams.topic || ''}>
            <option value="">All topics</option>
            {topics.map((t) => <option key={t.id} value={t.name}>{t.name}</option>)}
          </select>
          <select name="days" className="border rounded px-3 py-2" defaultValue={searchParams.days || ''}>
            <option value="">All</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
          </select>
          <button className="bg-brand text-white rounded px-3 py-2">Filter</button>
        </form>
      </section>
      <h1 className="text-2xl font-bold">Latest from ReligiousLiberty.TV</h1>
      {state?.lastStatusNote && <p className="text-sm text-slate-500">Status: {state.lastStatusNote} (serving cached data when needed).</p>}
      <div className="grid md:grid-cols-2 gap-4">
        {posts.map((post) => (
          <article key={post.id} className="bg-white border rounded p-4">
            <h2 className="font-semibold text-lg">{post.title}</h2>
            <p className="text-sm text-slate-500">{post.dateDisplay || post.dateISO?.toISOString() || 'Date unavailable'}</p>
            <p className="mt-2 text-sm">{post.excerpt || 'Excerpt unavailable from list pages.'}</p>
            <a href={post.canonicalUrl} target="_blank" rel="noreferrer" className="underline mt-3 inline-block">Read on site</a>
            <ShareButtons postId={post.id} title={post.title} />
          </article>
        ))}
      </div>
      <a href="https://religiousliberty.tv/listen-to-articles/" target="_blank" rel="noreferrer" className="underline text-sm">Listen mode (on site)</a>
      <SubscriptionForm />
    </div>
  );
}
