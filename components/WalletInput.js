'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './WalletInput.module.css';

/**
 * WalletInput — reusable address entry component.
 *
 * Props:
 *   onSubmit(address) — optional callback; if omitted the component navigates
 *                       directly to /[address] via next/navigation.
 *   showCard          — bool (default true). When true wraps content in the
 *                       styled card. When false renders bare input + button.
 */
export default function WalletInput({ onSubmit, showCard = true }) {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  function validate(input) {
    const trimmed = input.trim();
    if (!trimmed) return 'Enter a wallet address or ENS name.';
    if (trimmed.endsWith('.eth')) return '';
    if (/^0x[a-fA-F0-9]{40}$/.test(trimmed)) return '';
    return 'Enter a valid 0x address (42 chars) or .eth name.';
  }

  function submit(address) {
    if (onSubmit) {
      onSubmit(address);
    } else {
      router.push(`/${address}`);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = value.trim();
    const err = validate(trimmed);
    if (err) {
      setError(err);
      return;
    }
    setError('');
    submit(trimmed);
  }

  function handleChange(e) {
    setValue(e.target.value);
    if (error) setError('');
  }

  function handleTryVitalik() {
    submit('vitalik.eth');
  }

  const inner = (
    <>
      <span className={styles.cardIcon}>◈</span>

      <h2 className={styles.cardHeading}>Paste your wallet to begin</h2>

      <p className={styles.cardSubtext}>
        Enter any EVM address or ENS name.{' '}
        <span className={styles.accentText}>Nothing is stored.</span>{' '}
        Everything is computed live.
      </p>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <input
          className={styles.input}
          type="text"
          placeholder="0x... or yourname.eth"
          value={value}
          onChange={handleChange}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.submitBtn}>
          Generate Resume →
        </button>
      </form>

      <button type="button" onClick={handleTryVitalik} className={styles.tryLink}>
        or try with vitalik.eth
      </button>
    </>
  );

  if (!showCard) {
    return <div className={styles.bare}>{inner}</div>;
  }

  return <div className={styles.card}>{inner}</div>;
}
