'use client';

import { useState } from 'react';

type Props = { postId: number; title: string };

export default function ShareButtons({ postId, title }: Props) {
  const [link, setLink] = useState('');

  async function createLink() {
    const res = await fetch('/api/share', { method: 'POST', body: JSON.stringify({ postId }) });
    const data = await res.json();
    setLink(data.shortUrl);
    return data.shortUrl as string;
  }

  return (
    <div className="mt-3 text-sm">
      <button className="px-2 py-1 border rounded" onClick={createLink}>Share</button>
      {link && (
        <div className="mt-2 flex gap-2 items-center flex-wrap">
          <button onClick={() => navigator.clipboard.writeText(link)} className="underline">Copy link</button>
          <a href={`https://x.com/intent/tweet?url=${encodeURIComponent(link)}&text=${encodeURIComponent(title)}`} target="_blank" rel="noreferrer" className="underline">Share to X</a>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`} target="_blank" rel="noreferrer" className="underline">Facebook</a>
          <a href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(link)}`} className="underline">Email</a>
          <button onClick={async () => {
            const u = link || await createLink();
            if (navigator.share) await navigator.share({ title, url: u });
          }} className="underline">Web Share</button>
        </div>
      )}
    </div>
  );
}
