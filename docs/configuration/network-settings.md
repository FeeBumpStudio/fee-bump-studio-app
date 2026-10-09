# Network Settings

## Network Configuration

The app supports two Stellar networks:

| Network | Passphrase | Use Case |
|---------|------------|----------|
| **Testnet** | `Test SDF Network ; September 2015` | Development, testing, CI |
| **Mainnet** | `Public Global Stellar Network ; September 2015` | Production |

## RPC Endpoints

### Testnet

| Provider | URL | Notes |
|----------|-----|-------|
| **SDF Public** | `https://soroban-testnet.stellar.org` | Free, rate-limited, default |
| **QuickNode** | `https://your-endpoint.quicknode.com` | Paid, higher limits |
| **Self-hosted** | `https://your-rpc.example.com` | Full control |

### Mainnet

| Provider | URL | Notes |
|----------|-----|-------|
| **Stellar RPC** | `https://rpc.stellar.org/your-project-id` | Official managed service |
| **QuickNode** | `https://your-endpoint.quicknode.com` | Multi-chain provider |
| **Blockdaemon** | `https://your-endpoint.blockdaemon.com` | Enterprise |
| **Self-hosted** | `https://your-rpc.example.com` | Full control |

> **Mainnet requires a dedicated RPC endpoint.** No public default exists.

## Network Switching

### Via Environment

```bash
# .env.local
STELLAR_NETWORK=mainnet
STELLAR_RPC_URL=https://rpc.stellar.org/your-project-id
```

Restart dev server after change.

### Via UI (Planned)

Future versions will support runtime network switching:

```typescript
// hooks/useNetwork.ts
const { network, switchNetwork } = useNetwork();

<select value={network} onChange={(e) => switchNetwork(e.target.value)}>
  <option value="testnet">Testnet</option>
  <option value="mainnet">Mainnet</option>
</select>
```

## Network Validation

The app verifies network configuration:

```typescript
async function validateNetwork(rpcUrl: string, expectedPassphrase: string) {
  const server = new rpc.Server(rpcUrl);
  const ledger = await server.getLatestLedger();
  
  // Verify network passphrase matches
  const networkConfig = await server.getNetworkConfig();
  if (networkConfig.networkPassphrase !== expectedPassphrase) {
    throw new Error(`Network mismatch: expected ${expectedPassphrase}, got ${networkConfig.networkPassphrase}`);
  }
  
  return ledger.sequence;
}
```

## Contract Deployment Per Network

Contracts must be deployed separately per network:

| Network | Contract ID | Deployment |
|---------|-------------|------------|
| Testnet | `CABC...TESTNET` | `make deploy-testnet` |
| Mainnet | `CXYZ...MAINNET` | `make deploy-mainnet` |

Set `STELLAR_CONTRACT_ID` to match the target network.

## Account Compatibility

| Account Type | Testnet | Mainnet |
|--------------|---------|---------|
| **Funded via Friendbot** | ✅ Yes | ❌ No |
| **Exchange withdrawal** | ✅ Yes | ✅ Yes |
| **Existing Mainnet account** | ❌ No | ✅ Yes |

Testnet and Mainnet are **completely separate** — accounts, balances, and contracts do not transfer.

## Rate Limits

| Provider | Testnet Limit | Mainnet Limit |
|----------|---------------|---------------|
| SDF Public | 100 req/min | N/A |
| Stellar RPC | N/A | Tier-based |
| QuickNode | Plan-based | Plan-based |
| Self-hosted | Configurable | Configurable |

## Monitoring

Recommended alerts:

- RPC error rate > 5%
- RPC latency > 2s (p95)
- Rate limit approaching 80%
- Ledger sync lag > 30s

## Troubleshooting

| Issue | Check |
|-------|-------|
| "Network mismatch" | Verify `STELLAR_NETWORK` matches RPC endpoint |
| "Contract not found" | Ensure contract deployed on target network |
| "Insufficient balance" | Fund account on correct network (Friendbot for Testnet) |
| "Transaction failed" | Check diagnostic events via RPC |

## Related Documentation

- [Environment Variables](environment-variables.md)
- [Deployment - Environment Setup](../deployment/environment-setup.md)
- [Stellar Networks](https://developers.stellar.org/docs/learn/fundamentals/networks)