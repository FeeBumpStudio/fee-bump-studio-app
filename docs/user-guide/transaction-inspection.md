# Transaction Inspection

## Overview

Transaction inspection is a core feature that allows users to:

1. **Parse** raw XDR transaction envelopes
2. **Decode** operations, fees, and metadata
3. **Validate** against current network state
4. **Reference** related contracts and accounts

## Current Status

> 🚧 **Planned Feature** — Not yet implemented in the baseline.

## Planned Implementation

### Input Methods

| Method | Description |
|--------|-------------|
| **Paste XDR** | Raw transaction envelope in base64 |
| **Transaction Hash** | Lookup from network via RPC |
| **Wallet Export** | Import from connected wallet |
| **Backend API** | Fetch from indexer (requires backend) |

### Displayed Information

| Section | Details |
|---------|---------|
| **Header** | Source account, sequence, fee, memo, time bounds |
| **Operations** | Type, source, destination, amounts, asset codes |
| **Fee Analysis** | Current fee vs. network minimum, bump estimate |
| **Signatures** | Existing signatures, required signers |
| **Metadata** | Result codes, diagnostic events (if executed) |
| **References** | Contract IDs, claimable balances, liquidity pools |

### Fee-Bump Context

For fee-bump transactions specifically:

- **Inner Transaction** — The original transaction being bumped
- **Fee Source** — Account paying the bump fee
- **Fee Amount** — Replacement fee vs. original fee
- **Validity** — Whether the bump is valid per network rules

## Integration Points

- **Stellar SDK** — `TransactionEnvelope.fromXDR()`, `Transaction.fromEnvelope()`
- **RPC** — `getTransaction`, `getLatestLedger` for current state
- **Backend** — Indexed transaction data for enriched display
- **Contracts** — Contract-specific operation decoding

## Example (Planned UI)

```
┌─────────────────────────────────────────────────────┐
│ Transaction Inspection                              │
├─────────────────────────────────────────────────────┤
│ Hash:    a1b2c3... (copy)  [View on Stellar Expert] │
│ Network: Testnet                                    │
│ Status:  ✅ Included in ledger 12345678             │
├─────────────────────────────────────────────────────┤
│ Source:  GABC...XYZ                                 │
│ Sequence: 42                                        │
│ Fee:     1000000 stroops (0.0001 XLM)              │
│ Memo:    "FeeBumpStudio: refund-2024-001"          │
├─────────────────────────────────────────────────────┤
│ Operations (2):                                     │
│  1. Payment                                         │
│     From: GABC...XYZ  →  To: GBDE...UVW            │
│     Amount: 100.00 USDC                             │
│  2. InvokeHostFunction (Contract)                   │
│     Contract: CABC...CONTRACT                       │
│     Function: record_refund                         │
│     Auth: GABC...XYZ                                │
├─────────────────────────────────────────────────────┤
│ Fee Analysis:                                       │
│  Current: 1000000  |  Min: 100000  |  Suggested: 2000000 │
│  [Prepare Fee Bump]                                 │
└─────────────────────────────────────────────────────┘
```

## Related Documentation

- [Fee Estimation](fee-estimation.md)
- [Fee-Bump Preparation](fee-bump-preparation.md)
- [Stellar SDK Integration](../api-reference/stellar-sdk.md)