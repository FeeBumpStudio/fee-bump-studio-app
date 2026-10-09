# Configuration

## Environment Variables

Copy the example file and customize it:

```bash
cp .env.example .env.local
```

### `.env.example` Reference

```ini
[TEMPLATE]
STELLAR_NETWORK=testnet
STELLAR_RPC_URL=
STELLAR_CONTRACT_ID=
PORT=3000
```

### Variable Details

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `STELLAR_NETWORK` | Yes | `testnet` | Target Stellar network: `testnet` or `mainnet` |
| `STELLAR_RPC_URL` | No | (public default) | Soroban RPC endpoint URL. Leave empty to use the public Testnet default. For production, use a dedicated RPC provider. |
| `STELLAR_CONTRACT_ID` | Yes* | — | Deployed Soroban contract ID for contract interactions. Required for fee-bump features. |
| `PORT` | No | `3000` | Port for the development server |

> *Required when contract features are enabled. The baseline app may work without it for UI development.

## Network Configuration

### Testnet (Development)

```ini
STELLAR_NETWORK=testnet
STELLAR_RPC_URL=https://soroban-testnet.stellar.org
STELLAR_CONTRACT_ID=CABC...YOUR_CONTRACT_ID
```

### Mainnet (Production)

```ini
STELLAR_NETWORK=mainnet
STELLAR_RPC_URL=https://your-dedicated-rpc-provider.com
STELLAR_CONTRACT_ID=CABC...YOUR_CONTRACT_ID
```

> **Important**: Never commit `.env.local` or any file containing real credentials. The `.gitignore` excludes `.env*` files while keeping `.env.example`.

## Contract Address Discovery

To find your deployed contract ID:

1. Deploy the contract via `fee-bump-studio-contracts` (see [contracts deployment](../deployment/build.md))
2. Copy the contract ID from the deployment output
3. Paste it into `STELLAR_CONTRACT_ID`

## Verification

After configuration, verify the environment is loaded correctly:

```bash
npm run dev
```

Check the browser console for network configuration logs. The app displays the current network in the UI header.