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

## 2026-03-24 21:32:59

**What was built:**
- SEO and Open Graph implementation for public launch
- `app/layout.js` — updated root metadata with `metadataBase`, `title.template`, `openGraph`, and `twitter` fields
- `app/[wallet]/page.js` — rewritten as a thin server component exporting `generateMetadata` (per-wallet title, description, OG/Twitter tags with dynamic OG image URL)
- `app/[wallet]/WalletResumePage.js` — new client component containing all previous resume page logic; debug `console.log` removed; Twitter share button added to footer
- `app/api/og/route.js` — Edge runtime `ImageResponse` endpoint (1200×630): dark bg with dot grid, avatar initials, wallet display name, bottom stats row
- `next.config.mjs` — added `images.domains: ['wlltresume.xyz']`
- `app/[wallet]/page.module.css` — added `.twitterBtn` style (Twitter blue `#1d9bf0`, outlined, matches footer button shape)
- Initial commit pushed to `https://github.com/KaizenBanjaLuka/walletresume`

**Decisions made:**
- Split `[wallet]/page.js` into server wrapper + client component because `generateMetadata` is silently ignored when exported from a `'use client'` file in Next.js 14
- `generateMetadata` computes display name from params only (no Alchemy call) — keeps metadata fast and avoids double-fetching
- OG image shows static `—` placeholders for stat values (live data would require an Alchemy call in the edge function, adds latency; can revisit)
- Twitter share button is an `<a>` tag (not `<button>`) linking to `twitter.com/intent/tweet` with pre-filled text + URL

**Problems solved:**
- Remote repo already had a commit (GitHub auto-generated README) — resolved merge conflict by keeping the GitHub description, committed merge, then pushed successfully

**Next step:**
- Add `favicon.ico` and `apple-touch-icon.png` to `/public`
- Live end-to-end test with vitalik.eth using real Alchemy API key
- Consider populating OG image stats with live data (Alchemy call in edge function)
- Token balance display in resume (data is fetched but not rendered)
- Set up Vercel deployment and point `wlltresume.xyz` domain

---
