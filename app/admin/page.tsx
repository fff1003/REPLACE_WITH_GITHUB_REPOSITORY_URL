import { prisma } from '@/lib/db/client';
import { env } from '@/lib/utils/env';
import Link from 'next/link';

export default async function Admin({ searchParams }: { searchParams: { password?: string } }) {
  if (searchParams.password !== env.adminPassword) {
    return <p>Unauthorized. Pass ?password=ADMIN_PASSWORD</p>;
  }

  const links = await prisma.shareLink.findMany({ include: { clicks: true }, orderBy: { createdAt: 'desc' }, take: 20 });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Admin Analytics</h1>
      <p className="text-sm text-slate-600">Conversion proxy = redirect clicks to religiousliberty.tv tracked by /r links.</p>
      <Link href={`/api/admin/export?password=${searchParams.password}`} className="underline">Export CSV</Link>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.id} className="bg-white border rounded p-3 flex justify-between">
            <span>{l.shortId} → {l.destination}</span>
            <span>{l.clicks.length} clicks</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
