# Environment Variables

## Complete Reference

All environment variables for the FeeBumpStudio App:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `STELLAR_NETWORK` | Yes | `testnet` | Target network: `testnet` or `mainnet` |
| `STELLAR_RPC_URL` | No | Public default | Soroban RPC endpoint URL |
| `STELLAR_CONTRACT_ID` | Yes* | — | Deployed contract ID |
| `PORT` | No | `3000` | Development server port |

> *Required for contract features; UI baseline works without it.

## Variable Details

### STELLAR_NETWORK

```ini
# Testnet (development)
STELLAR_NETWORK=testnet

# Mainnet (production)
STELLAR_NETWORK=mainnet
```

Controls:
- Network passphrase used in transactions
- Default RPC endpoint if `STELLAR_RPC_URL` not set
- UI network indicator

### STELLAR_RPC_URL

```ini
# Use public Testnet (development only)
STELLAR_RPC_URL=

# Dedicated RPC (recommended for production)
STELLAR_RPC_URL=https://rpc.stellar.org/your-project-id
STELLAR_RPC_URL=https://your-endpoint.quicknode.com/your-token
```

If empty:
- Testnet → `https://soroban-testnet.stellar.org`
- Mainnet → **Required** (no public default)

### STELLAR_CONTRACT_ID

```ini
# Contract ID from deployment
STELLAR_CONTRACT_ID=CABC123...YOUR_CONTRACT_ID
```

Format: Stellar address starting with `C` (contract)

### PORT

```ini
# Default
PORT=3000

# Alternative
PORT=3001
```

Only affects development server (`npm run dev`).

## Environment Files

### .env.example (Committed)

Template with all variables and defaults:

```ini
[TEMPLATE]
STELLAR_NETWORK=testnet
STELLAR_RPC_URL=
STELLAR_CONTRACT_ID=
PORT=3000
```

### .env.local (Local Only, Gitignored)

Your actual configuration:

```ini
STELLAR_NETWORK=testnet
STELLAR_RPC_URL=https://soroban-testnet.stellar.org
STELLAR_CONTRACT_ID=CABC123...YOUR_CONTRACT_ID
PORT=3000
```

### .env.production (Deployment)

For production deployments:

```ini
STELLAR_NETWORK=mainnet
STELLAR_RPC_URL=https://your-dedicated-rpc.com
STELLAR_CONTRACT_ID=CXYZ789...YOUR_MAINNET_CONTRACT
PORT=3000
```

## Loading Priority

Next.js loads in order (highest priority wins):

1. `process.env` (system environment)
2. `.env.local` (local overrides)
3. `.env.production` / `.env.development` (environment-specific)
4. `.env` (general)
5. `.env.example` (template, not loaded by Next.js)

## Validation

The app validates on startup:

```typescript
// lib/config.ts
export function validateConfig(): Config {
  const network = process.env.STELLAR_NETWORK;
  if (!["testnet", "mainnet"].includes(network)) {
    throw new Error(`Invalid STELLAR_NETWORK: ${network}`);
  }
  
  if (network === "mainnet" && !process.env.STELLAR_RPC_URL) {
    throw new Error("STELLAR_RPC_URL required for mainnet");
  }
  
  return {
    network,
    rpcUrl: process.env.STELLAR_RPC_URL,
    contractId: process.env.STELLAR_CONTRACT_ID,
    port: parseInt(process.env.PORT || "3000", 10),
  };
}
```

## Security Checklist

- [ ] Never commit `.env.local`, `.env.production`, or any `.env.*` with real values
- [ ] Use different contract IDs for Testnet/Mainnet
- [ ] Use dedicated RPC for production
- [ ] Rotate RPC credentials periodically
- [ ] Monitor RPC usage and rate limits

## CI/CD Variables

Set in GitHub repository settings → Secrets and variables → Actions:

| Secret | Purpose |
|--------|---------|
| `STELLAR_NETWORK` | Deployment target network |
| `STELLAR_RPC_URL` | RPC for deployment verification |
| `STELLAR_CONTRACT_ID` | Contract to verify against |
| `VERCEL_TOKEN` | Vercel deployment (if used) |
| `VERCEL_ORG_ID` | Vercel organization |
| `VERCEL_PROJECT_ID` | Vercel project |

## Related Documentation

- [Network Settings](network-settings.md)
- [Deployment - Environment Setup](../deployment/environment-setup.md)
- [Security - Assumptions](../security/assumptions.md)