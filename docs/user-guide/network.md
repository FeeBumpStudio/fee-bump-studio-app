# Network Selection

## Current Implementation

The baseline application displays the configured network in the UI header:

```tsx
<p>Network: Testnet development configuration.</p>
```

Network is determined by the `STELLAR_NETWORK` environment variable.

## Supported Networks

| Network | Chain ID | RPC Endpoint | Use Case |
|---------|----------|--------------|----------|
| **Testnet** | `Test SDF Network ; September 2015` | `https://soroban-testnet.stellar.org` | Development, testing |
| **Mainnet** | `Public Global Stellar Network ; September 2015` | Dedicated provider required | Production |

## Switching Networks

### Via Environment Variable

```bash
# .env.local
STELLAR_NETWORK=mainnet
STELLAR_RPC_URL=https://your-rpc-provider.com
```

Restart the dev server after changing.

### Via UI (Planned)

Future versions will include a network selector in the header:

```
[Testnet ▼]  [Mainnet]  [Custom RPC]
```

## RPC Configuration

### Public Testnet (Default)

```ini
STELLAR_NETWORK=testnet
STELLAR_RPC_URL=
```

Uses the public Soroban Testnet RPC. Rate-limited, suitable for development only.

### Dedicated RPC (Recommended for Production)

```ini
STELLAR_NETWORK=mainnet
STELLAR_RPC_URL=https://rpc.stellar.org/your-project-id
# or
STELLAR_RPC_URL=https://your-endpoint.quicknode.com/your-token
```

Providers:
- [Stellar RPC](https://rpc.stellar.org/) — Official managed RPC
- [QuickNode](https://www.quicknode.com/chains/stellar) — Multi-chain provider
- [Blockdaemon](https://blockdaemon.com/protocols/stellar/) — Enterprise infrastructure
- Self-hosted — Run your own Soroban RPC server

## Network Validation

The app validates network configuration on startup:

1. Checks `STELLAR_NETWORK` value
2. Attempts RPC connection (if URL provided)
3. Verifies network passphrase matches expectation
4. Displays status in UI

## Troubleshooting Network Issues

| Symptom | Cause | Solution |
|---------|-------|----------|
| "Network: Unknown" | Invalid `STELLAR_NETWORK` | Use `testnet` or `mainnet` |
| RPC connection timeout | Unreachable RPC URL | Check URL, firewall, provider status |
| Wrong network passphrase | Mismatched network/RPC | Ensure RPC matches `STELLAR_NETWORK` |
| Contract not found | Contract deployed on different network | Deploy contract on target network, update `STELLAR_CONTRACT_ID` |

## Security Notes

- **Never use public RPC for production** — Rate limits and no SLAs
- **Verify RPC endpoint authenticity** — Use HTTPS, known providers
- **Testnet ≠ Mainnet** — Contracts, accounts, and balances are separate