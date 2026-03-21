'use client';

import { useState, useEffect } from 'react';
import styles from './LoadingScreen.module.css';

const STEPS = [
  'Fetching wallet age & balance',
  'Scanning protocol interactions',
  'Reading DAO participation',
  'Pulling NFT collections',
  'Computing reputation score',
];

function shortenForDisplay(address) {
  if (!address) return '';
  if (address.endsWith('.eth')) return address;
  if (address.length > 12) return `${address.slice(0, 6)}...${address.slice(-4)}`;
  return address;
}

export default function LoadingScreen({ address }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (activeStep >= STEPS.length) return;
    const t = setTimeout(() => setActiveStep(s => s + 1), 600);
    return () => clearTimeout(t);
  }, [activeStep]);

  return (
    <div className={styles.overlay}>
      <div className={styles.inner}>

        <div className={styles.brand}>
          WLLTRESUME<span className={styles.brandAccent}>.XYZ</span>
        </div>

        <div className={styles.walletBlock}>
          <span className={styles.analyzeLabel}>Analyzing Onchain History</span>
          <div className={styles.walletAddr}>{shortenForDisplay(address)}</div>
        </div>

        <div className={styles.steps}>
          {STEPS.map((step, i) => {
            const done   = i < activeStep;
            const active = i === activeStep;
            return (
              <div
                key={step}
                className={[
                  styles.step,
                  active ? styles.stepActive : '',
                  done   ? styles.stepDone   : '',
                ].filter(Boolean).join(' ')}
              >
                <span className={styles.dot} />
                <span className={styles.stepLabel}>{step}</span>
                {done && <span className={styles.check}>✓</span>}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
