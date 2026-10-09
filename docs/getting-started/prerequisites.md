# Prerequisites

## System Requirements

| Requirement | Version | Notes |
|-------------|---------|-------|
| **Node.js** | ≥ 18.x | LTS recommended |
| **npm** | ≥ 9.x | Included with Node.js |
| **Git** | ≥ 2.x | For cloning and version control |

## Recommended Tools

| Tool | Purpose |
|------|---------|
| **VS Code** | Recommended editor with TypeScript support |
| **Stellar Laboratory** | Transaction inspection and debugging |
| **Stellar Expert** | Network explorer for Testnet/Mainnet |

## Network Access

The application connects to Stellar networks via RPC endpoints:

- **Testnet** (default): `https://soroban-testnet.stellar.org` — Free, public, rate-limited
- **Mainnet**: Requires a dedicated RPC provider (e.g., [Stellar RPC](https://rpc.stellar.org/), [QuickNode](https://www.quicknode.com/), self-hosted)

> **Note**: For production use, always use a dedicated RPC endpoint with appropriate rate limits and SLAs.

## Wallet Requirements

For full functionality, users need a Stellar wallet that supports:

- Transaction signing (XDR)
- Contract invocation
- Network switching (Testnet/Mainnet)

Supported wallets include:
- [Freighter](https://freighter.app/)
- [Albedo](https://albedo.link/)
- [Rabet](https://rabet.xyz/)

## Browser Compatibility

| Browser | Minimum Version |
|---------|-----------------|
| Chrome | 110+ |
| Firefox | 115+ |
| Safari | 16+ |
| Edge | 110+ |

Modern JavaScript features (ES2022+) are used. No polyfills are included.