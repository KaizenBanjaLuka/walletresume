import WalletInput from '@/components/WalletInput';
import styles from './page.module.css';

const CHAINS = ['ETHEREUM', 'BASE', 'ARBITRUM', 'OPTIMISM', 'POLYGON'];

const STATS = [
  { number: '5',   label: 'Chains Supported' },
  { number: '7',   label: 'Resume Sections'  },
  { number: '100', label: 'Rep Score Scale'  },
];

export default function HomePage() {
  return (
    <div className={styles.wrapper}>

      {/* ── Navigation ── */}
      <nav className={styles.nav}>
        <div className={styles.container}>
          <div className={styles.navInner}>
            <div className={styles.navLeft}>
              <div className={styles.navBrand}>
                WLLTRESUME<span className={styles.navAccent}>.XYZ</span>
              </div>
              <div className={styles.navProtocol}>Onchain Resume Protocol</div>
            </div>
            <div className={styles.navRight}>
              <button className={styles.connectBtn}>Connect Wallet</button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>

            <div className={styles.pill}>
              <span className={styles.pillDot}>●</span>
              Resume Builder V1
            </div>

            <h1 className={styles.headline}>
              <span className={styles.headlineWhite}>Build your</span>
              <span className={styles.headlinePurple}>onchain</span>
              <span className={styles.headlinePurple}>resume.</span>
            </h1>

            <p className={styles.bodyText}>
              wlltresume analyzes your wallet&apos;s entire onchain history and
              generates a shareable resume. No signup. Nothing is stored.
              Your keys, your story.
            </p>

            <div className={styles.chainTags}>
              {CHAINS.map(chain => (
                <span key={chain} className={styles.chainTag}>{chain}</span>
              ))}
              <span className={`${styles.chainTag} ${styles.chainTagMuted}`}>
                + MORE SOON
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* ── Input card ── */}
      <section className={styles.inputSection}>
        <WalletInput showCard={true} />
      </section>

      {/* ── Stats footer ── */}
      <footer className={styles.statsFooter}>
        <div className={styles.statsContainer}>
          {STATS.map(({ number, label }) => (
            <div key={label} className={styles.statItem}>
              <span className={styles.statNumber}>{number}</span>
              <span className={styles.statLabel}>{label}</span>
            </div>
          ))}
        </div>
      </footer>

    </div>
  );
}
