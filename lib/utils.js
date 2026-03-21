// Utility functions for the on-chain resume app.

// ---------------------------------------------------------------------------
// calculateReputationScore
// Produces a score out of 100 broken into five weighted categories.
// Input: the profile object returned by getFullWalletProfile.
// ---------------------------------------------------------------------------
export function calculateReputationScore(profile) {
  const { walletAge, transactionCount, protocolInteractions, multiChain } = profile ?? {};

  // ── Wallet Age — max 25 pts ──────────────────────────────────────────────
  const ageYears = walletAge?.ageInYears ?? 0;
  let ageScore;
  if      (ageYears < 0.5) ageScore = 0;
  else if (ageYears < 1)   ageScore = 5;
  else if (ageYears < 2)   ageScore = 10;
  else if (ageYears < 4)   ageScore = 15;
  else if (ageYears < 7)   ageScore = 20;
  else                     ageScore = 25;

  // ── Transaction Count — max 20 pts (log scale) ──────────────────────────
  // ~10 txns=5pts, ~100=10pts, ~1000=15pts, ~10000+=20pts
  const txCount = transactionCount?.count ?? 0;
  const txScore = Math.min(20, Math.round(Math.log10(txCount + 1) * 5));

  // ── Protocol Diversity — max 20 pts ─────────────────────────────────────
  // 2pts per unique protocol + 2pt bonus if multiple categories are spanned
  const protocols       = protocolInteractions?.protocols ?? [];
  const uniqueNames     = [...new Set(protocols.map(p => p.name))];
  const uniqueCategories = [...new Set(protocols.map(p => p.category))];
  const protocolScore   = Math.min(uniqueNames.length * 2 + (uniqueCategories.length > 1 ? 2 : 0), 20);

  // ── DAO Participation — max 20 pts ───────────────────────────────────────
  // Baseline 2pts (absence of data ≠ no participation)
  const daoProtocols = protocols.filter(p => p.category === 'dao');
  let daoScore;
  if      (daoProtocols.length === 0) daoScore = 2;
  else if (daoProtocols.length <= 2)  daoScore = 10;
  else if (daoProtocols.length <= 5)  daoScore = 15;
  else                                daoScore = 20;

  // ── Chain Diversity — max 15 pts ─────────────────────────────────────────
  const chains      = multiChain?.chains ?? [];
  const activeCount = chains.filter(c => c.txCount > 0).length;
  const CHAIN_PTS   = [0, 3, 7, 10, 13, 15];
  const chainScore  = CHAIN_PTS[Math.min(activeCount, 5)];

  const breakdown = {
    age:          { score: ageScore,      max: 25, label: 'Wallet Age' },
    transactions: { score: txScore,       max: 20, label: 'Transaction History' },
    protocols:    { score: protocolScore, max: 20, label: 'Protocol Diversity' },
    daos:         { score: daoScore,      max: 20, label: 'DAO Participation' },
    chains:       { score: chainScore,    max: 15, label: 'Chain Diversity' },
  };

  const total = Math.min(
    Object.values(breakdown).reduce((sum, d) => sum + d.score, 0),
    100
  );

  return { total, breakdown };
}

// ---------------------------------------------------------------------------
// shortenAddress — "0x71C7…6D9C" format
// ---------------------------------------------------------------------------
export function shortenAddress(address) {
  if (!address || address.length < 10) return address ?? '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// ---------------------------------------------------------------------------
// formatDate — returns "March 2025" style string
// ---------------------------------------------------------------------------
export function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    year:  'numeric',
  });
}
