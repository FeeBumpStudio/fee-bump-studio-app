# History & Events

## Overview

The history view provides an auditable log of all protocol interactions:

- Submitted transactions
- Contract invocations
- Fee-bump operations
- Indexed events from backend

## Current Status

> 🚧 **Planned Feature** — Requires backend indexer integration.

## Data Sources

| Source | Data | Latency |
|--------|------|---------|
| **Local Storage** | User's submitted transactions | Instant |
| **Backend API** | Indexed network events | Near real-time |
| **RPC** | On-demand transaction lookup | On-demand |
| **Contract Events** | Emitted contract events | Via backend indexer |

## Event Types

| Event Type | Description | Key Fields |
|------------|-------------|------------|
| `transaction_submitted` | User submitted a transaction | hash, fee, status, timestamp |
| `fee_bump_prepared` | Fee-bump envelope created | inner_hash, bump_hash, fees |
| `contract_invoked` | Soroban contract called | contract_id, function, auth |
| `transaction_confirmed` | Ledger inclusion confirmed | hash, ledger, result_code |
| `transaction_failed` | Transaction failed | hash, error_code, diagnostic |

## UI Design (Planned)

```
┌─────────────────────────────────────────────────────────────┐
│ History                                          [Filter ▼] │
├─────────────────────────────────────────────────────────────┤
│ 🔵 2 min ago   Fee Bump Prepared                            │
│     Inner: a1b2c3...  Bump: d4e5f6...  Fee: 2M → 5M       │
│     [View Details] [Stellar Expert] [Copy Hashes]          │
├─────────────────────────────────────────────────────────────┤
│ ✅ 15 min ago  Transaction Confirmed                        │
│     Hash: a1b2c3...  Ledger: 12345678  Fee: 1M            │
│     [View Details] [Stellar Expert] [Contract Events]      │
├─────────────────────────────────────────────────────────────┤
│ 🟡 1 hour ago  Contract Invoked                             │
│     Contract: CABC...  Function: record_refund             │
│     Auth: GABC...  Ref: refund-2024-001                    │
│     [View Details] [Contract State] [Explorer]             │
├─────────────────────────────────────────────────────────────┤
│ ❌ 2 hours ago  Transaction Failed                          │
│     Hash: z9y8x7...  Error: txINSUFFICIENT_BALANCE         │
│     [View Diagnostics] [Retry with Fee Bump]               │
└─────────────────────────────────────────────────────────────┘
```

## Filtering & Search

| Filter | Options |
|--------|---------|
| **Time Range** | Last hour, 24h, 7d, 30d, Custom |
| **Status** | Pending, Confirmed, Failed, All |
| **Type** | Payment, Contract, Fee-Bump, All |
| **Account** | Source, Destination, Fee Source |
| **Contract** | Specific contract ID |
| **Search** | Hash, reference, memo text |

## Export & Integration

- **CSV Export** — Download filtered results
- **JSON API** — Programmatic access via backend
- **Webhooks** — Real-time notifications (planned)

## Privacy Considerations

- History stored locally by default
- Backend indexer only stores public network data
- No private keys or signatures in history
- User can clear local history anytime

## Related Documentation

- [Backend Indexer](https://feebumpstudio.github.io/fee-bump-studio-backend/)
- [Contract Events](../api-reference/contract-interaction.md#events)
- [Troubleshooting Failed Transactions](../troubleshooting/common-errors.md)