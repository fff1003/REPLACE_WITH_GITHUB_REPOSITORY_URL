import './globals.css';
import Link from 'next/link';
import { startScheduler } from '@/lib/notifications/scheduler';

startScheduler();

export const metadata = {
  title: 'ReligiousLiberty.TV Reader',
  description: 'Discover, share, and return for new ReligiousLiberty.TV posts'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between">
            <Link href="/" className="font-bold text-brand">ReligiousLiberty.TV Reader</Link>
            <a href="https://religiousliberty.tv" target="_blank" className="text-sm underline" rel="noreferrer">Visit ReligiousLiberty.TV</a>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
        <footer className="max-w-6xl mx-auto px-4 py-10 text-sm text-slate-600 space-x-4">
          <a href="https://religiousliberty.tv/about1/" target="_blank" rel="noreferrer">About</a>
          <a href="https://religiousliberty.tv/about-2__trashed/contact-us/" target="_blank" rel="noreferrer">Contact</a>
          <a href="https://religiousliberty.tv" target="_blank" rel="noreferrer">Read on ReligiousLiberty.TV</a>
        </footer>
      </body>
    </html>
  );
}
