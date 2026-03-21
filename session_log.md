# wlltresume.xyz — Session Log

---

## 2026-03-21 15:55:06

**What was built:**
- Full Next.js 14 App Router project scaffolded (`/app`, `/lib`, `/components`) with plain JS, ESLint, no Tailwind
- Installed: `ethers`, `@rainbow-me/rainbowkit`, `wagmi`, `viem`
- `lib/alchemy.js` — complete Alchemy data layer: `getWalletAge`, `getTransactionCount`, `getTokenBalances`, `getNFTs`, `getAssetTransfers`, `getMultiChainSummary`, `getFullWalletProfile`
- `lib/utils.js` — `calculateReputationScore`, `shortenAddress`, `formatDate`
- `app/layout.js` — Space Mono via `next/font/google`, global CSS with `#0d0d1a` + dot-grid background
- `app/page.js` + `app/page.module.css` — full landing page: nav, left-aligned hero, wallet input card, stats footer
- `components/WalletInput.js` + CSS module — reusable input with validation (`0x` address or `.eth`), "try vitalik.eth" shortcut, `showCard` prop
- `components/LoadingScreen.js` + CSS module — animated 5-step progress list, dots advance every 600ms
- `app/[wallet]/page.js` + CSS module — full resume page: ENS resolution, reverse lookup, LoadingScreen while fetching, 6 resume sections (header card, protocol experience, DAO participation, chain activity, NFT portfolio, resume footer), share-to-clipboard, PDF tooltip

**Decisions made:**
- Client-side data fetching in `[wallet]/page.js` (`'use client'`) rather than server component + Suspense — simpler and matches "on mount" semantics
- `Promise.allSettled` in `getFullWalletProfile` so one failing section never crashes the whole profile
- Ethers loaded via dynamic `import('ethers')` in the wallet page to keep initial bundle lean
- Reputation score baseline of 2pts for DAO when no data found (absence ≠ no participation)
- `getMultiChainSummary` uses per-chain `try/catch` with `Promise.all` so 403s on Polygon/Optimism silently return `unavailable: true` and are filtered from results
- `KNOWN_PROTOCOLS` expanded to 52 entries covering Uniswap V2/V3/V4, Aave, Compound, Curve, Lido, MakerDAO, Balancer, Yearn, Convex, Rocket Pool, 1inch, ENS, Gnosis Safe, OpenSea, Blur, LooksRare, X2Y2, and all major bridges

**Problems solved:**
- ESLint error `react/jsx-no-comment-textnodes` — `// Section Title` strings inside JSX wrapped in `{'// ...'}` expressions
- Stale `.next` cache corruption (caused by running `next build` while dev server was active) — fixed by `rm -rf .next` before restarting dev
- Polygon/Optimism 403 errors crashing `getMultiChainSummary` — isolated with per-chain try/catch
- Reputation score underrating vitalik.eth (50/100) — rewrote scoring with tiered age brackets, proper log scale for tx count, multi-category protocol bonus, DAO baseline, and stepped chain diversity table
- Score breakdown return shape updated from flat numbers to `{ score, max, label }` objects; resume page renders compact bar rows inside the header card score block

**Next step:**
- Add real Alchemy API key to `.env.local` and do a live end-to-end test with vitalik.eth
- Build out the `/share` or OG image generation for the shareable resume link
- Consider adding token balance display to the resume (currently fetched but not rendered)
- Mobile layout polish pass
- Remove the temporary `console.log` added for score debugging before launch

---
