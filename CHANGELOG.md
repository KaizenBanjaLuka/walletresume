# Changelog — wlltresume (wlltresume.xyz)

All notable changes to this project will be documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
Versioning: [Semantic Versioning](https://semver.org/) — MAJOR.MINOR.PATCH

---

## [Unreleased]

### Open Issues (active)
- `#8` task: Mobile Responsive Design (Frontend) — **next priority**
- `#9` bug: Remove Wallet Connect (Frontend) — opened yesterday
- `#10` feat: Clickable Home button (Frontend) — opened yesterday

### Open Issues (should be closed — features already shipped in v1.0.0)
> ⚠️ These issues are open but the features are live. Close them on GitHub.
- `#2` Alchemy Data Layer (Backend) — **shipped in v1.0.0**
- `#5` Resume page (Frontend) — **shipped in v1.0.0**
- `#6` Reputation Score Algorithm (Backend + Blockchain) — **shipped in v1.0.0**
- `#7` Shareable Resume Link & SEO (Frontend) — **shipped in v1.0.0**

### Roadmap (no ticket yet)
- PDF export
- DAO detection improvements
- Connect Wallet flow — auto-generate your own resume
- WalletRep × wlltresume cross-reference integration (issue on both repos)
- Wallet Passport integration (Phase 3)

---

## [1.0.0] — Initial Launch

### Added

**Core product**
- Landing page with wallet input — supports both `0x` addresses and ENS names
- ENS resolution via ethers.js
- Animated loading screen with step-by-step progress feedback
- Dynamic resume page at `wlltresume.xyz/[wallet]` — unique URL per wallet
- No wallet connection required — fully read-only, nothing stored

**Resume sections**
- Protocol detection — identifies 25+ DeFi, NFT, bridge, and DAO protocols from transaction history
- Chain activity breakdown — Ethereum, Base, Arbitrum, Optimism, Polygon
- NFT portfolio — collections held, grouped by contract
- DAO participation detection
- Reputation score — 0–100 across 5 dimensions: Wallet Age (25pts), Transaction History (20pts), Protocol Diversity (20pts), DAO Participation (20pts), Chain Diversity (15pts)

**Distribution & sharing**
- Dynamic OG image generation (`/api/og`) — rich link previews on Twitter, Discord, Telegram
- Shareable link with one-click clipboard copy
- Cross-reference link to wlltrep.xyz for wallet owners

**Infrastructure**
- Next.js 14 App Router, plain JavaScript, custom CSS
- Alchemy API data layer (`getAssetTransfers`, `getNFTsForOwner`, `getTokenBalances`)
- Vercel deployment — auto-deploys on push to `main`
- `.env.local` for API key — never committed, covered by `.gitignore`

---

*wlltresume — Your keys, your story.*
