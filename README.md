# wlltresume — Onchain Resume Builder

**Generate a shareable Web3 CV from any EVM wallet. No signup. Nothing stored. Everything computed live.**

🌐 [wlltresume.xyz](https://wlltresume.xyz) · [WalletRep Suite](https://wlltrep.xyz) · [Kanban Board](https://github.com/orgs/KaizenBanjaLuka/projects/2)

---

## What it does

Paste any EVM wallet address or ENS name and wlltresume generates a clean, shareable resume from public onchain data — protocol experience, DAO participation, NFT portfolio, chain activity, and a reputation score.

Every resume lives at a unique URL: `wlltresume.xyz/0x...` or `wlltresume.xyz/vitalik.eth`

No wallet connection required. No data stored. Your keys, your story.

---

## Part of the Web3 Identity Suite

wlltresume is the second product in a three-layer identity stack:

| Layer | Product | Role |
|---|---|---|
| 1 | [wlltrep.xyz](https://wlltrep.xyz) | Private reputation scoring — connect your wallet, get your score |
| 2 | [wlltresume.xyz](https://wlltresume.xyz) | Public identity presentation — shareable onchain resume |
| 3 | Wallet Passport *(in planning)* | Portable soulbound credential NFT — [read the PRD](../docs/WalletPassport_PRD.md) |

---

## Features

- **ENS resolution** — works with `.eth` names and `0x` addresses
- **Protocol detection** — identifies 25+ DeFi, NFT, bridge, and DAO protocols from transaction history
- **Chain activity** — multichain breakdown across Ethereum, Base, Arbitrum, Optimism, Polygon
- **NFT portfolio** — collections held, grouped by contract
- **Reputation score** — 0–100 score across 5 dimensions with visual breakdown
- **Dynamic OG images** — rich link previews when shared on Twitter, Discord, Telegram
- **Shareable link** — one-click copy of `wlltresume.xyz/[wallet]`
- **Cross-reference** — links to wlltrep.xyz for wallet owners to check their reputation score

---

## Reputation Score

Scores are calculated client-side from Alchemy data across 5 dimensions:

| Dimension | Max Points | Method |
|---|---|---|
| Wallet Age | 25 | Tiered by years active |
| Transaction History | 20 | Logarithmic scale |
| Protocol Diversity | 20 | 2pts per protocol, bonus for cross-category |
| DAO Participation | 20 | Tiered by DAOs found |
| Chain Diversity | 15 | 3pts per chain beyond Ethereum |

---

## Stack

- **Framework:** Next.js 14 App Router (plain JavaScript, no TypeScript)
- **Styling:** Custom CSS — no Tailwind, no UI libraries
- **Data:** Alchemy API (free tier) — `getAssetTransfers`, `getNFTsForOwner`, `getTokenBalances`
- **Web3:** ethers.js for ENS resolution
- **Deployment:** Vercel (auto-deploys on push to `main`)
- **Domain:** wlltresume.xyz via Namecheap

---

## Project Structure

```
/app
  /[wallet]         # Resume page — dynamic route per wallet
    page.js
  page.js           # Landing page
  layout.js         # Root layout, fonts, global metadata
  /api/og           # Dynamic OG image generation
/components
  WalletInput.js    # Reusable input with ENS validation
  LoadingScreen.js  # Animated loading steps
  ResumeCard.js     # Resume sections
/lib
  alchemy.js        # All Alchemy API calls
  utils.js          # Reputation scoring algorithm, helpers
/public
  favicon.ico
```

---

## Local Development

**Prerequisites:** Node.js 18+, an Alchemy API key

```bash
git clone https://github.com/KaizenBanjaLuka/walletresume.git
cd walletresume
npm install
```

Create `.env.local` in the project root:

```
NEXT_PUBLIC_ALCHEMY_API_KEY=your_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

```bash
npm run dev
```

Open `http://localhost:3000` and try any wallet address or ENS name.

> ⚠️ Never commit `.env.local` — it's in `.gitignore`. Add your Alchemy key separately in Vercel environment variables for production.

---

## Deployment

Connected to Vercel via GitHub. Every push to `main` auto-deploys to [wlltresume.xyz](https://wlltresume.xyz).

To deploy your own fork:
1. Fork this repo
2. Import into [Vercel](https://vercel.com)
3. Add `NEXT_PUBLIC_ALCHEMY_API_KEY` in Vercel environment variables
4. Add your custom domain in Vercel → Settings → Domains

---

## Design System

wlltresume shares a visual language with [wlltrep.xyz](https://wlltrep.xyz) — same family, slightly different tone.

| Token | Value |
|---|---|
| Background | `#0d0d1a` (dark navy) |
| Background secondary | `#11112a` |
| Accent | `#7b6ff0` (purple) |
| Text primary | `#e8e6f0` |
| Text muted | `#6b6b8a` |
| Font | Space Mono (monospace everywhere) |
| Labels | Uppercase, `letter-spacing: 0.12em` |
| Borders | `1px solid #1e1e3a` |

---

## Roadmap

- [x] Landing page with wallet input and ENS resolution
- [x] Animated loading screen
- [x] Resume page with all 5 sections
- [x] Reputation score algorithm
- [x] Dynamic OG image generation
- [x] Shareable link + clipboard copy
- [x] Cross-reference to wlltrep.xyz
- [ ] Mobile responsive (Issue #8)
- [ ] Connect Wallet flow — auto-generate your own resume
- [ ] PDF export
- [ ] DAO detection improvements
- [ ] Wallet Passport integration (Phase 3)

---

## Related Projects

| Project | URL | Repo |
|---|---|---|
| WalletRep — reputation scoring | [wlltrep.xyz](https://wlltrep.xyz) | [github.com/KaizenBanjaLuka](https://github.com/KaizenBanjaLuka) |
| Wallet Passport — credential NFT | *in planning* | [PRD →](../docs/WalletPassport_PRD.md) |
| Portfolio | [github.com/KaizenBanjaLuka](https://github.com/KaizenBanjaLuka) | — |

---

## How it was built

This project was built using AI-assisted development — Claude for product decisions and architecture, Claude Code for implementation. Every decision about what to build, how to structure it, and what to prioritize was made by the product manager. The code was directed, not written manually.

Read more about this workflow: [How I Manage Entire Products as a Solo PM — Without a Single Engineer](https://medium.com/@fikko87_90982/how-i-manage-entire-products-as-a-solo-pm-without-a-single-engineer-d0da213d457b)

---

*Built by [Bojan Pilipovic](https://github.com/KaizenBanjaLuka) · [wlltresume.xyz](https://wlltresume.xyz) · [Medium](https://medium.com/@fikko87_90982)*
