import WalletResumePage from './WalletResumePage';

// ---------------------------------------------------------------------------
// generateMetadata — server-side, reads params without fetching profile data
// ---------------------------------------------------------------------------
export async function generateMetadata({ params }) {
  const wallet = params.wallet;
  const isENS  = wallet.toLowerCase().endsWith('.eth');
  const displayName = isENS
    ? wallet
    : `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;

  const title       = `${displayName} — Onchain Resume`;
  const description = `View ${displayName}'s onchain resume — protocol experience, DAO participation, NFT portfolio and reputation score. Built on wlltresume.xyz`;
  const url         = `https://wlltresume.xyz/${wallet}`;
  const ogImage     = `https://wlltresume.xyz/api/og?wallet=${encodeURIComponent(wallet)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'wlltresume.xyz',
      type:     'profile',
      images:   [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card:        'summary_large_image',
      title,
      description,
      images:      [ogImage],
    },
  };
}

// ---------------------------------------------------------------------------
// Page — renders the client component
// ---------------------------------------------------------------------------
export default function WalletPage({ params }) {
  return <WalletResumePage params={params} />;
}
