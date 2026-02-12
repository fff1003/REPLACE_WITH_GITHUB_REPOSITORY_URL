'use client';

import { FormEvent, useState } from 'react';

export default function SubscriptionForm() {
  const [msg, setMsg] = useState('');

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const res = await fetch('/api/subscriptions', {
      method: 'POST',
      body: JSON.stringify({
        email: form.get('email'),
        frequency: form.get('frequency'),
        wantsWebPush: form.get('wantsWebPush') === 'on'
      })
    });
    const data = await res.json();
    setMsg(data.message);
  }

  return (
    <form onSubmit={submit} className="bg-white border rounded p-4 space-y-3">
      <h2 className="font-semibold">Get new posts</h2>
      <input name="email" type="email" placeholder="you@example.com" className="w-full border rounded px-3 py-2" required />
      <select name="frequency" className="w-full border rounded px-3 py-2">
        <option value="daily">Daily digest</option>
        <option value="instant">Instant updates</option>
      </select>
      <label className="text-sm flex gap-2"><input type="checkbox" name="wantsWebPush" /> Enable web push (optional)</label>
      <button className="bg-brand text-white px-4 py-2 rounded">Subscribe</button>
      {msg && <p className="text-sm text-green-700">{msg}</p>}
    </form>
  );
}
