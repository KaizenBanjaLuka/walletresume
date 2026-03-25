'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LoadingScreen from '@/components/LoadingScreen';
import { getFullWalletProfile } from '@/lib/alchemy';
import { calculateReputationScore, shortenAddress } from '@/lib/utils';
import styles from './page.module.css';

// ---------------------------------------------------------------------------
// Design constants
// ---------------------------------------------------------------------------
const CATEGORY_COLORS = {
  defi:   { border: '#7b6ff0', color: '#7b6ff0' },
  nft:    { border: '#f97316', color: '#f97316' },
  dao:    { border: '#22d3a0', color: '#22d3a0' },
  bridge: { border: '#6b6b8a', color: '#6b6b8a' },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getInitials(address, ens) {
  if (ens) return ens.replace('.eth', '').slice(0, 2).toUpperCase();
  if (address && address.length >= 4) return address.slice(2, 4).toUpperCase();
  return '??';
}

function getDaoBadge(interactions) {
  if (interactions > 20) return 'DELEGATE';
  if (interactions > 5)  return 'VOTER';
  return 'CONTRIBUTOR';
}

async function resolveEns(name) {
  const { JsonRpcProvider } = await import('ethers');
  const key = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
  const provider = new JsonRpcProvider(
    `https://eth-mainnet.g.alchemy.com/v2/${key}`
  );
  return provider.resolveName(name);
}

async function reverseLookup(address) {
  try {
    const { JsonRpcProvider } = await import('ethers');
    const key = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
    const provider = new JsonRpcProvider(
      `https://eth-mainnet.g.alchemy.com/v2/${key}`
    );
    return await provider.lookupAddress(address);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Shared sub-components
// ---------------------------------------------------------------------------
function Nav() {
  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <div className={styles.navInner}>
          <div className={styles.navLeft}>
            <Link href="/" className={styles.navBrandLink}>
              <div className={styles.navBrand}>
                WLLTRESUME<span className={styles.navAccent}>.XYZ</span>
              </div>
              <div className={styles.navProtocol}>Onchain Resume Protocol</div>
            </Link>
          </div>
          <div className={styles.navRight}>
            <a
              href="https://alchemy.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.builtOnLink}
            >
              Built on Alchemy
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

function SectionTitle({ children }) {
  return <div className={styles.sectionTitle}>{children}</div>;
}

function EmptyState({ text }) {
  return <div className={styles.emptyState}>{text}</div>;
}

function ErrorView({ address }) {
  return (
    <div className={styles.errorPage}>
      <Nav />
      <div className={styles.errorWrap}>
        <div className={styles.errorCard}>
          <div className={styles.errorIcon}>⚠</div>
          <div className={styles.errorTitle}>Wallet Not Found</div>
          <p className={styles.errorText}>
            {address} could not be resolved or has no onchain history.
          </p>
          <Link href="/" className={styles.errorBack}>← New Search</Link>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function WalletResumePage({ params }) {
  const rawParam = params.wallet;

  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState(null);
  const [profile,         setProfile]         = useState(null);
  const [score,           setScore]           = useState(null);
  const [resolvedAddress, setResolvedAddress] = useState(null);
  const [ensName,         setEnsName]         = useState(null);
  const [copied,          setCopied]          = useState(false);

  useEffect(() => {
    async function load() {
      try {
        let address = rawParam;
        let ens     = null;

        if (rawParam.toLowerCase().endsWith('.eth')) {
          // Forward-resolve ENS → address
          ens = rawParam;
          const resolved = await resolveEns(rawParam);
          if (!resolved) throw new Error(`ENS name "${rawParam}" could not be resolved.`);
          address = resolved;
        } else if (/^0x[a-fA-F0-9]{40}$/.test(rawParam)) {
          // Valid 0x address — attempt reverse ENS lookup for display
          address = rawParam;
          const name = await reverseLookup(rawParam);
          if (name) ens = name;
        } else {
          throw new Error(`"${rawParam}" is not a valid Ethereum address or ENS name.`);
        }

        setResolvedAddress(address);
        setEnsName(ens);

        const profileData = await getFullWalletProfile(address);
        const scoreData   = calculateReputationScore(profileData);

        setProfile(profileData);
        setScore(scoreData);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [rawParam]);

  // ── Loading ──
  if (loading) return <LoadingScreen address={rawParam} />;

  // ── Error / not found ──
  if (error || !profile) return <ErrorView address={rawParam} />;

  const hasHistory =
    profile.transactionCount.count > 0 ||
    profile.nfts.totalCount > 0 ||
    profile.tokenBalances.tokens.length > 0;

  if (!hasHistory) return <ErrorView address={rawParam} />;

  // ── Derived data ──
  const displayAddress = resolvedAddress ?? rawParam;
  const firstTxYear    = profile.walletAge.firstTxDate
    ? new Date(profile.walletAge.firstTxDate).getFullYear()
    : null;
  const activeChains   = profile.multiChain.chains.filter(c => c.txCount > 0);
  const daoProtocols   = profile.protocolInteractions.protocols.filter(p => p.category === 'dao');
  const sortedChains   = [...activeChains].sort((a, b) => b.txCount - a.txCount);

  const headerStats = [
    { value: profile.transactionCount.count.toLocaleString(), label: 'Transactions' },
    { value: activeChains.length,                             label: 'Chains Active' },
    { value: profile.protocolInteractions.protocols.length,   label: 'Protocols Used' },
    { value: profile.nfts.totalCount,                         label: 'NFTs Held' },
  ];

  const shareUrl = `https://wlltresume.xyz/${displayAddress}`;

  function handleShare() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    'Check out my onchain resume on wlltresume.xyz'
  )}&url=${encodeURIComponent(shareUrl)}`;

  // ── Resume ──
  return (
    <div className={styles.page}>
      <Nav />

      <div className={styles.container}>
        <main className={styles.main}>

          {/* Back link */}
          <Link href="/" className={styles.backLink}>← New Search</Link>

          {/* ── 1. Resume Header Card ── */}
          <div className={styles.headerCard}>
            <div className={styles.headerTop}>

              <div className={styles.avatar}>
                {getInitials(displayAddress, ensName)}
              </div>

              <div className={styles.identity}>
                {ensName && (
                  <div className={styles.ensNameText}>{ensName}</div>
                )}
                <div className={styles.walletAddrText}>
                  {shortenAddress(displayAddress)}
                </div>
                {firstTxYear && (
                  <div className={styles.walletMetaText}>
                    Onchain Since {firstTxYear} · {profile.walletAge.ageLabel}
                  </div>
                )}
              </div>

              <div className={styles.scoreBlock}>
                <div className={styles.scoreNum}>{score?.total ?? 0}</div>
                <div className={styles.scoreLabel}>Rep Score</div>
                {score?.breakdown && (
                  <div className={styles.scoreBreakdown}>
                    {Object.entries(score.breakdown).map(([key, dim]) => (
                      <div key={key} className={styles.breakdownRow}>
                        <span className={styles.breakdownLabel}>{dim.label}</span>
                        <div className={styles.breakdownBar}>
                          <div
                            className={styles.breakdownFill}
                            style={{ width: `${Math.round((dim.score / dim.max) * 100)}%` }}
                          />
                        </div>
                        <span className={styles.breakdownScore}>
                          {dim.score}<span className={styles.breakdownMax}>/{dim.max}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            <div className={styles.statsRow}>
              {headerStats.map(({ value, label }) => (
                <div key={label} className={styles.statCol}>
                  <span className={styles.statBigVal}>{value}</span>
                  <span className={styles.statSmallLabel}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Cross-reference ── */}
          <div className={styles.crossRef}>
            Own this wallet? Check your reputation score on{' '}
            <a
              href="https://wlltrep.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.crossRefLink}
            >
              WLLTREP.XYZ →
            </a>
          </div>

          {/* ── 2. Protocol Experience ── */}
          <div className={styles.section}>
            <SectionTitle>{'// Protocol Experience'}</SectionTitle>
            {profile.protocolInteractions.protocols.length > 0 ? (
              <div className={styles.tagList}>
                {profile.protocolInteractions.protocols.map(p => {
                  const colors = CATEGORY_COLORS[p.category] ?? { border: '#1e1e3a', color: '#6b6b8a' };
                  return (
                    <span
                      key={p.name}
                      className={styles.protoTag}
                      style={{ borderColor: colors.border, color: colors.color }}
                    >
                      {p.name}
                      <span className={styles.tagCount}>· {p.interactions}</span>
                    </span>
                  );
                })}
              </div>
            ) : (
              <EmptyState text="No Protocol Data Found" />
            )}
          </div>

          {/* ── 3. DAO Participation ── */}
          <div className={styles.section}>
            <SectionTitle>{'// DAO Participation'}</SectionTitle>
            {daoProtocols.length > 0 ? (
              <div className={styles.daoList}>
                {daoProtocols.map(dao => (
                  <div key={dao.name} className={styles.daoRow}>
                    <div className={styles.daoInfo}>
                      <div className={styles.daoNameText}>{dao.name}</div>
                      <div className={styles.daoMetaText}>
                        {dao.interactions} Governance Actions
                      </div>
                    </div>
                    <span className={styles.daoBadgeTag}>
                      {getDaoBadge(dao.interactions)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState text="No DAO Participation Found" />
            )}
          </div>

          {/* ── 4. Chain Activity ── */}
          <div className={styles.section}>
            <SectionTitle>{'// Chain Activity'}</SectionTitle>
            {sortedChains.length > 0 ? (
              <div className={styles.chainList}>
                {sortedChains.map(chain => (
                  <div key={chain.name} className={styles.chainRow}>
                    <span className={styles.chainNameText}>{chain.name}</span>
                    <div className={styles.barTrack}>
                      <div
                        className={styles.barFill}
                        style={{ width: `${Math.max(chain.percentage, 2)}%` }}
                      />
                    </div>
                    <span className={styles.chainMetaText}>
                      {chain.txCount.toLocaleString()} txs · {chain.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState text="No Chain Activity Found" />
            )}
          </div>

          {/* ── 5. NFT Portfolio ── */}
          <div className={styles.section}>
            <SectionTitle>{'// NFT Portfolio'}</SectionTitle>
            {profile.nfts.collections.length > 0 ? (
              <div className={styles.nftGrid}>
                {profile.nfts.collections.map(col => (
                  <div key={col.contractAddress} className={styles.nftCard}>
                    <div className={styles.nftCardName}>{col.name}</div>
                    <div className={styles.nftCardCount}>{col.count} Held</div>
                    <div className={styles.nftCardStatus}>● Active</div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState text="No NFT Portfolio Found" />
            )}
          </div>

          {/* ── 6. Resume Footer ── */}
          <div className={styles.resumeFooter}>
            <button onClick={handleShare} className={styles.outlinedBtn}>
              {copied ? 'Copied!' : 'Share This Resume'}
            </button>

            <a
              href={tweetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.twitterBtn}
            >
              Share on Twitter
            </a>

            <div className={styles.pdfWrap}>
              <button className={styles.outlinedBtn}>PDF Export</button>
              <div className={styles.tooltip}>Coming Soon</div>
            </div>

            <span className={styles.powered}>Powered by Wlltresume.xyz</span>
          </div>

        </main>
      </div>
    </div>
  );
}
