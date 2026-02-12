import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || 'ReligiousLiberty.TV Reader';
  const date = searchParams.get('date') || '';

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#0f172a', color: 'white', padding: 40 }}>
        <div style={{ fontSize: 42, fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: 24, marginTop: 20 }}>ReligiousLiberty.TV • {date}</div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
