let disallowed: string[] | null = null;

export async function loadRobots(base = 'https://religiousliberty.tv') {
  if (disallowed) return disallowed;
  try {
    const res = await fetch(`${base}/robots.txt`);
    if (!res.ok) return [];
    const txt = await res.text();
    disallowed = txt
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.toLowerCase().startsWith('disallow:'))
      .map((line) => line.split(':')[1]?.trim() || '')
      .filter(Boolean);
    return disallowed;
  } catch {
    return [];
  }
}

export async function isAllowed(url: string) {
  const rules = await loadRobots();
  const p = new URL(url).pathname;
  return !rules.some((r) => r !== '/' && p.startsWith(r));
}
