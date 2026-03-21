import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const wallet = searchParams.get('wallet') ?? '';

  const isENS = wallet.toLowerCase().endsWith('.eth');
  const displayName = isENS
    ? wallet
    : wallet.length >= 10
      ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}`
      : wallet;

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#0d0d1a',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 72px',
          fontFamily: 'monospace',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Dot grid overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle, #2a2a4a 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            opacity: 0.5,
          }}
        />

        {/* Top: brand + label */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', letterSpacing: '0.06em' }}>
              WLLTRESUME<span style={{ color: '#7b6ff0' }}>.XYZ</span>
            </div>
            <div style={{ fontSize: '10px', color: '#6b6b8a', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Onchain Resume Protocol
            </div>
          </div>
          <div
            style={{
              border: '1px solid #7b6ff0',
              color: '#7b6ff0',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              padding: '6px 14px',
              borderRadius: '3px',
            }}
          >
            Onchain Resume
          </div>
        </div>

        {/* Middle: wallet identity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: '#7b6ff0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 700,
              color: '#ffffff',
            }}
          >
            {isENS
              ? displayName.replace('.eth', '').slice(0, 2).toUpperCase()
              : wallet.length >= 4 ? wallet.slice(2, 4).toUpperCase() : '??'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '48px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em', lineHeight: 1.1 }}>
              {displayName}
            </div>
            <div style={{ fontSize: '14px', color: '#6b6b8a', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              View full onchain resume →
            </div>
          </div>
        </div>

        {/* Bottom: stats labels */}
        <div
          style={{
            display: 'flex',
            gap: '40px',
            borderTop: '1px solid #1e1e3a',
            paddingTop: '24px',
            position: 'relative',
          }}
        >
          {['Transactions', 'Chains Active', 'Protocols Used', 'NFTs Held', 'Rep Score'].map(label => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ fontSize: '10px', color: '#6b6b8a', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                {label}
              </div>
              <div style={{ fontSize: '14px', color: '#7b6ff0', fontWeight: 700 }}>—</div>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      width:  1200,
      height: 630,
    }
  );
}
