// Alchemy data layer for on-chain resume.
// All functions use Alchemy's JSON-RPC API (https://<network>.g.alchemy.com/v2/<key>)
// and the NFT REST API (https://eth-mainnet.g.alchemy.com/nft/v3/<key>).

// ---------------------------------------------------------------------------
// Known protocol contract addresses → { name, category }
// ---------------------------------------------------------------------------
export const KNOWN_PROTOCOLS = {
  // ── Uniswap ──────────────────────────────────────────────────────────────
  '0x7a250d5630b4cf539739df2c5dacb4c659f2488d': { name: 'Uniswap V2',           category: 'defi'   },
  '0xe592427a0aece92de3edee1f18e0157c05861564': { name: 'Uniswap V3',           category: 'defi'   },
  '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45': { name: 'Uniswap V3',           category: 'defi'   },
  '0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad': { name: 'Uniswap V3',           category: 'defi'   }, // Universal Router
  '0x000000000004444c5dc75cb358380d2e3de08a90': { name: 'Uniswap V4',           category: 'defi'   },
  // ── Aave ─────────────────────────────────────────────────────────────────
  '0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9': { name: 'Aave V2',              category: 'defi'   },
  '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2': { name: 'Aave V3',              category: 'defi'   },
  // ── Compound ─────────────────────────────────────────────────────────────
  '0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b': { name: 'Compound V2',          category: 'defi'   },
  '0xc3d688b66703497daa19211eedff47f25384cdc3': { name: 'Compound V3',          category: 'defi'   },
  // ── Curve ────────────────────────────────────────────────────────────────
  '0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7': { name: 'Curve',                category: 'defi'   }, // 3pool
  '0xd533a949740bb3306d119cc777fa900ba034cd52': { name: 'Curve',                category: 'defi'   }, // CRV token
  '0x99a58482bd75cbab83b27ec03ca68ff489b5788f': { name: 'Curve',                category: 'defi'   }, // Router
  // ── Lido ─────────────────────────────────────────────────────────────────
  '0xae7ab96520de3a18e5e111b5eaab095312d7fe84': { name: 'Lido',                 category: 'defi'   }, // stETH
  '0x889edc2edab5f40e902b864ad4d7ade8e412f9b1': { name: 'Lido',                 category: 'defi'   }, // Withdrawals
  // ── MakerDAO ─────────────────────────────────────────────────────────────
  '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2': { name: 'MakerDAO',             category: 'dao'    }, // MKR token
  // ── Balancer ─────────────────────────────────────────────────────────────
  '0xba12222222228d8ba445958a75a0704d566bf2c8': { name: 'Balancer V2',          category: 'defi'   }, // Vault
  // ── Yearn ────────────────────────────────────────────────────────────────
  '0x50c1a2ea0a861a967d9d0ffe2ae4012c2e053804': { name: 'Yearn Finance',        category: 'defi'   },
  // ── Convex ───────────────────────────────────────────────────────────────
  '0xf403c135812408bfbe8713b5a23a04b3d48aae31': { name: 'Convex',               category: 'defi'   },
  // ── Rocket Pool ──────────────────────────────────────────────────────────
  '0xdd3f50f8a6cafbe9b31a427582963f465e745af8': { name: 'Rocket Pool',          category: 'defi'   },
  // ── 1inch ────────────────────────────────────────────────────────────────
  '0x1111111254eeb25477b68fb85ed929f73a960582': { name: '1inch',                category: 'defi'   },
  '0x111111125421ca6dc452d289314280a0f8842a65': { name: '1inch',                category: 'defi'   },
  // ── ENS ──────────────────────────────────────────────────────────────────
  '0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e': { name: 'ENS',                  category: 'dao'    }, // Registry
  '0x283af0b28c62c092c9727f1ee09c02ca627eb7f5': { name: 'ENS',                  category: 'dao'    }, // Old Registrar
  '0x253553366da8546fc250f225fe3d25d0c782303b': { name: 'ENS',                  category: 'dao'    }, // ETH Registrar Controller
  '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85': { name: 'ENS',                  category: 'dao'    }, // Base Registrar
  // ── Gnosis Safe ──────────────────────────────────────────────────────────
  '0xa6b71e26c5e0845f74c812102ca7114b6a896ab2': { name: 'Gnosis Safe',          category: 'dao'    }, // Factory
  // ── OpenSea ──────────────────────────────────────────────────────────────
  '0x00000000006c3852cbef3e08e8df289169ede581': { name: 'OpenSea',              category: 'nft'    }, // Seaport 1.1
  '0x0000000000000068f116a894984e2db1123eb395': { name: 'OpenSea',              category: 'nft'    }, // Seaport 1.5
  '0x00000000000001ad428e4906ae43d8f9852d0dd6': { name: 'OpenSea',              category: 'nft'    }, // Seaport 1.4
  // ── Blur ─────────────────────────────────────────────────────────────────
  '0x000000000000ad05ccc4f10045630fb830b95127': { name: 'Blur',                 category: 'nft'    },
  '0x39da41747a83aee658334415666f3ef92dd0d541': { name: 'Blur',                 category: 'nft'    }, // Blend
  // ── LooksRare ────────────────────────────────────────────────────────────
  '0x59728544b08ab483533076417fbbb2fd0b17ce3c': { name: 'LooksRare',            category: 'nft'    },
  // ── X2Y2 ─────────────────────────────────────────────────────────────────
  '0x74312363e45dcaba76c59ec49a13aa35017c56be': { name: 'X2Y2',                 category: 'nft'    },
  // ── Bridges ──────────────────────────────────────────────────────────────
  '0x8315177ab297ba92a06054ce80a67ed4dbd7ed3a': { name: 'Arbitrum Bridge',      category: 'bridge' },
  '0x4dbd4fc535ac27206064b68ffcf827b0a60bab3f': { name: 'Arbitrum Bridge',      category: 'bridge' }, // Inbox
  '0x99c9fc46f92e8a1c0dec1b1747d010903e884be1': { name: 'Optimism Bridge',      category: 'bridge' },
  '0xbeb5fc579115071764c7423a4f12edde41f106ed': { name: 'Optimism Bridge',      category: 'bridge' },
  '0x49048044d57e1c92a77f79988d21fa8faf74e97f': { name: 'Base Bridge',          category: 'bridge' },
  '0x49048044d57e1c92a77f79988d21fa8faf74e97e': { name: 'Base Bridge',          category: 'bridge' },
  '0x3154cf16ccdb4c6d922629664174b904d80f2c35': { name: 'Base Bridge',          category: 'bridge' },
  '0xa0c68c638235ee32657e8f720a23cec1bfc77c77': { name: 'Polygon Bridge',       category: 'bridge' },
  '0xb8901acb165ed027e32754e0ffe830802919727f': { name: 'Hop Protocol',         category: 'bridge' },
  '0x4d9079bb4165aeb4084c526a32695dcfd2f77381': { name: 'Across Protocol',      category: 'bridge' },
};

// ---------------------------------------------------------------------------
// Network config
// ---------------------------------------------------------------------------
const NETWORKS = {
  ethereum: 'eth-mainnet',
  polygon:  'polygon-mainnet',
  arbitrum: 'arb-mainnet',
  base:     'base-mainnet',
  optimism: 'opt-mainnet',
};

function getRpcUrl(network) {
  const key = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
  return `https://${NETWORKS[network]}.g.alchemy.com/v2/${key}`;
}

function getNftBaseUrl() {
  const key = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
  return `https://eth-mainnet.g.alchemy.com/nft/v3/${key}`;
}

// ---------------------------------------------------------------------------
// Core JSON-RPC helper
// ---------------------------------------------------------------------------
async function rpc(network, method, params = []) {
  const res = await fetch(getRpcUrl(network), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  if (!res.ok) throw new Error(`Alchemy HTTP ${res.status} on ${network}/${method}`);
  const json = await res.json();
  if (json.error) throw new Error(`Alchemy RPC error: ${json.error.message}`);
  return json.result;
}

// ---------------------------------------------------------------------------
// Token balance formatter (avoids floating-point overflow on large BigInts)
// ---------------------------------------------------------------------------
function formatTokenBalance(hexBalance, decimals) {
  try {
    const raw = BigInt(hexBalance);
    const factor = BigInt(10) ** BigInt(decimals);
    const whole = Number(raw / factor);
    // Fractional part scaled to 4 decimal places
    const fracScaled = Number((raw % factor) * 10000n / factor);
    return Math.round((whole + fracScaled / 10000) * 10000) / 10000;
  } catch {
    return 0;
  }
}

// ---------------------------------------------------------------------------
// 1. getWalletAge
// Endpoint: alchemy_getAssetTransfers (with order: "asc", pageSize 1) on both
//           fromAddress and toAddress to find the very first on-chain event.
//           Block timestamp is read from transfer.metadata.blockTimestamp (ISO
//           string returned when withMetadata: true).
// ---------------------------------------------------------------------------
export async function getWalletAge(address) {
  try {
    const baseParams = {
      fromBlock: '0x0',
      toBlock:   'latest',
      category:  ['external', 'internal', 'erc20', 'erc721', 'erc1155'],
      order:     'asc',
      withMetadata:    true,
      excludeZeroValue: false,
      maxCount:  '0x1',
    };

    const [outgoing, incoming] = await Promise.allSettled([
      rpc('ethereum', 'alchemy_getAssetTransfers', [{ ...baseParams, fromAddress: address }]),
      rpc('ethereum', 'alchemy_getAssetTransfers', [{ ...baseParams, toAddress:   address }]),
    ]);

    let earliestTimestamp = null;
    let earliestBlock = Infinity;

    for (const result of [outgoing, incoming]) {
      if (result.status !== 'fulfilled') continue;
      const transfer = result.value?.transfers?.[0];
      if (!transfer) continue;
      const blockNum = parseInt(transfer.blockNum, 16);
      if (blockNum < earliestBlock) {
        earliestBlock = blockNum;
        earliestTimestamp = transfer.metadata?.blockTimestamp ?? null;
      }
    }

    if (earliestBlock === Infinity) {
      return { firstTxDate: null, ageInYears: 0, ageLabel: 'Unknown' };
    }

    // Alchemy returns ISO 8601 string in metadata; fall back to eth_getBlockByNumber
    let firstTxDate;
    if (earliestTimestamp) {
      firstTxDate = new Date(earliestTimestamp);
    } else {
      const block = await rpc('ethereum', 'eth_getBlockByNumber', [
        `0x${earliestBlock.toString(16)}`,
        false,
      ]);
      firstTxDate = new Date(parseInt(block.timestamp, 16) * 1000);
    }

    const ageMs      = Date.now() - firstTxDate.getTime();
    const ageInYears = ageMs / (1000 * 60 * 60 * 24 * 365.25);
    const ageLabel   = ageInYears < 1
      ? `${Math.floor(ageInYears * 12)} months`
      : `${ageInYears.toFixed(1)} years`;

    return { firstTxDate, ageInYears, ageLabel };
  } catch (err) {
    console.error('getWalletAge error:', err);
    return { firstTxDate: null, ageInYears: 0, ageLabel: 'Unknown' };
  }
}

// ---------------------------------------------------------------------------
// 2. getTransactionCount
// Endpoint: eth_getTransactionCount — the nonce of an address equals the total
//           number of transactions it has ever sent on that network.
// ---------------------------------------------------------------------------
export async function getTransactionCount(address) {
  try {
    const hex = await rpc('ethereum', 'eth_getTransactionCount', [address, 'latest']);
    return { count: parseInt(hex, 16) };
  } catch (err) {
    console.error('getTransactionCount error:', err);
    return { count: 0 };
  }
}

// ---------------------------------------------------------------------------
// 3. getTokenBalances
// Endpoints:
//   alchemy_getTokenBalances(address, "erc20") — all ERC-20 holdings
//   alchemy_getTokenMetadata(contractAddress)  — name/symbol/decimals per token
// ---------------------------------------------------------------------------
export async function getTokenBalances(address) {
  try {
    const result = await rpc('ethereum', 'alchemy_getTokenBalances', [address, 'erc20']);

    const nonZero = (result.tokenBalances ?? [])
      .filter(t => !t.error && t.tokenBalance && t.tokenBalance !== '0x0')
      .slice(0, 50); // cap to avoid too many metadata calls

    if (nonZero.length === 0) return { tokens: [] };

    // Batch metadata — parallel but individually error-tolerant
    const metaResults = await Promise.allSettled(
      nonZero.map(t => rpc('ethereum', 'alchemy_getTokenMetadata', [t.contractAddress]))
    );

    const tokens = nonZero
      .map((t, i) => {
        const meta     = metaResults[i].status === 'fulfilled' ? metaResults[i].value : {};
        const decimals = meta.decimals ?? 18;
        const balance  = formatTokenBalance(t.tokenBalance, decimals);
        return {
          name:            meta.name    || 'Unknown Token',
          symbol:          meta.symbol  || '???',
          balance,
          contractAddress: t.contractAddress,
        };
      })
      .filter(t => t.balance > 0);

    return { tokens };
  } catch (err) {
    console.error('getTokenBalances error:', err);
    return { tokens: [] };
  }
}

// ---------------------------------------------------------------------------
// 4. getNFTs
// Endpoint: GET /nft/v3/{key}/getNFTsForOwner — Alchemy NFT REST API.
//           Returns up to 100 NFTs per page; we fetch one page and group by
//           collection contract address.
// ---------------------------------------------------------------------------
export async function getNFTs(address) {
  try {
    const url = `${getNftBaseUrl()}/getNFTsForOwner?owner=${address}&withMetadata=true&pageSize=100`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`NFT API error: ${res.status}`);
    const data = await res.json();

    const collectionMap = new Map();
    for (const nft of data.ownedNfts ?? []) {
      const contractAddress = nft.contract?.address?.toLowerCase();
      if (!contractAddress) continue;
      const name =
        nft.contract?.name ||
        nft.contract?.openSeaMetadata?.collectionName ||
        'Unknown Collection';
      if (!collectionMap.has(contractAddress)) {
        collectionMap.set(contractAddress, { name, count: 0, contractAddress });
      }
      collectionMap.get(contractAddress).count++;
    }

    const collections = Array.from(collectionMap.values())
      .sort((a, b) => b.count - a.count);

    return { collections, totalCount: data.totalCount ?? collections.length };
  } catch (err) {
    console.error('getNFTs error:', err);
    return { collections: [], totalCount: 0 };
  }
}

// ---------------------------------------------------------------------------
// 5. getAssetTransfers
// Endpoint: alchemy_getAssetTransfers — fetches up to 2 pages (2 000 transfers)
//           in each direction (from / to address). Contract addresses in each
//           transfer are matched against KNOWN_PROTOCOLS to count interactions.
// ---------------------------------------------------------------------------
export async function getAssetTransfers(address) {
  try {
    const baseParams = {
      fromBlock: '0x0',
      toBlock:   'latest',
      category:  ['external', 'internal', 'erc20', 'erc721', 'erc1155'],
      order:     'desc',
      excludeZeroValue: false,
      maxCount:  '0x3e8', // 1 000 per page
    };

    async function fetchPages(direction) {
      const param    = direction === 'from' ? 'fromAddress' : 'toAddress';
      const results  = [];
      let pageKey;
      for (let page = 0; page < 2; page++) {
        const params = { ...baseParams, [param]: address };
        if (pageKey) params.pageKey = pageKey;
        const data = await rpc('ethereum', 'alchemy_getAssetTransfers', [params]);
        results.push(...(data.transfers ?? []));
        pageKey = data.pageKey;
        if (!pageKey) break;
      }
      return results;
    }

    const [out, inc] = await Promise.allSettled([
      fetchPages('from'),
      fetchPages('to'),
    ]);

    const allTransfers = [
      ...(out.status === 'fulfilled' ? out.value : []),
      ...(inc.status === 'fulfilled' ? inc.value : []),
    ];

    const normalizedAddress = address.toLowerCase();
    const protocolCounts    = {};

    for (const transfer of allTransfers) {
      for (const addr of [transfer.to, transfer.from]) {
        if (!addr) continue;
        const lc       = addr.toLowerCase();
        const protocol = KNOWN_PROTOCOLS[lc];
        if (protocol && lc !== normalizedAddress) {
          if (!protocolCounts[protocol.name]) {
            protocolCounts[protocol.name] = { ...protocol, interactions: 0 };
          }
          protocolCounts[protocol.name].interactions++;
        }
      }
    }

    const protocols = Object.values(protocolCounts)
      .sort((a, b) => b.interactions - a.interactions);

    return { protocols };
  } catch (err) {
    console.error('getAssetTransfers error:', err);
    return { protocols: [] };
  }
}

// ---------------------------------------------------------------------------
// 6. getMultiChainSummary
// Endpoint: eth_getTransactionCount on each chain's Alchemy endpoint.
//           Returns tx counts and percentage share per chain.
// ---------------------------------------------------------------------------
export async function getMultiChainSummary(address) {
  const chainList = [
    { name: 'Ethereum', network: 'ethereum' },
    { name: 'Polygon',  network: 'polygon'  },
    { name: 'Arbitrum', network: 'arbitrum' },
    { name: 'Base',     network: 'base'     },
    { name: 'Optimism', network: 'optimism' },
  ];

  // Each chain is isolated — a 403 or timeout on one never affects the others.
  const raw = await Promise.all(
    chainList.map(async ({ name, network }) => {
      try {
        const hex = await rpc(network, 'eth_getTransactionCount', [address, 'latest']);
        return { name, txCount: parseInt(hex, 16) };
      } catch (err) {
        console.warn(`[wlltresume] ${name} unavailable (${err.message})`);
        return { name, txCount: 0, percentage: 0, unavailable: true };
      }
    })
  );

  // Drop chains with no activity (includes unavailable ones which land at 0)
  const active = raw.filter(c => c.txCount > 0);
  const total  = active.reduce((sum, c) => sum + c.txCount, 0);
  const chains = active.map(c => ({
    ...c,
    percentage: total > 0 ? Math.round((c.txCount / total) * 100) : 0,
  }));

  return { chains };
}

// ---------------------------------------------------------------------------
// 7. getFullWalletProfile
// Calls all six functions in parallel via Promise.allSettled.
// Each failed section falls back to an empty/default value so one bad API
// response never breaks the entire resume page.
// ---------------------------------------------------------------------------
export async function getFullWalletProfile(address) {
  const [age, txCount, tokens, nfts, protocols, chains] = await Promise.allSettled([
    getWalletAge(address),
    getTransactionCount(address),
    getTokenBalances(address),
    getNFTs(address),
    getAssetTransfers(address),
    getMultiChainSummary(address),
  ]);

  return {
    address,
    walletAge: age.status === 'fulfilled'
      ? age.value
      : { firstTxDate: null, ageInYears: 0, ageLabel: 'Unknown' },
    transactionCount: txCount.status === 'fulfilled'
      ? txCount.value
      : { count: 0 },
    tokenBalances: tokens.status === 'fulfilled'
      ? tokens.value
      : { tokens: [] },
    nfts: nfts.status === 'fulfilled'
      ? nfts.value
      : { collections: [], totalCount: 0 },
    protocolInteractions: protocols.status === 'fulfilled'
      ? protocols.value
      : { protocols: [] },
    multiChain: chains.status === 'fulfilled'
      ? chains.value
      : { chains: [] },
  };
}
