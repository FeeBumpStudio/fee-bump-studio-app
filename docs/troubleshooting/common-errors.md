# Common Errors

## Build Errors

### TypeScript Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Property 'X' does not exist on type 'Y'` | Missing type definitions | Check `@stellar/stellar-sdk` imports; update types |
| `Module not found` | Import path incorrect | Use `@/` alias or relative paths; check `tsconfig.json` paths |
| `JSX namespace not found` | Missing React types | Ensure `@types/react` in devDependencies |

### Build Failures

| Error | Cause | Solution |
|-------|-------|----------|
| `Out of memory` | Large bundle | `NODE_OPTIONS="--max-old-space-size=4096" npm run build` |
| `SIGBUS` / `SIGKILL` | Memory/CPU limits | Increase CI runner resources; optimize build |
| `Module parse failed` | Non-JS file imported | Add loader or move to `public/` |

## Runtime Errors

### Network Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Failed to fetch` / `NetworkError` | RPC unreachable | Check `STELLAR_RPC_URL`, network connectivity, CORS |
| `Timeout` | RPC slow | Increase timeout; use faster RPC provider |
| `Rate limited` | Too many requests | Implement backoff; upgrade RPC plan |

### Stellar SDK Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `RpcError: Invalid request` | Malformed RPC call | Check SDK version; validate request params |
| `PrepareTransactionError` | Simulation failed | Check diagnostic events; fix transaction |
| `TimeoutError` | Submission timeout | Transaction may succeed; check status via hash |
| `InvalidXDRError` | Corrupt XDR | Rebuild transaction; check encoding |

### Transaction Errors

| Error Code | Meaning | Resolution |
|------------|---------|------------|
| `txINSUFFICIENT_BALANCE` | Not enough XLM | Fund source account |
| `txBAD_SEQ` | Wrong sequence number | Reload account, rebuild transaction |
| `txBAD_AUTH` / `txMISSING_SIGNATURE` | Auth failed | Ensure all required signers signed |
| `txFEE_BUMP_INSUFFICIENT_FEE` | Bump fee too low | Increase replacement fee |
| `txINTERNAL_ERROR` | Ledger error | Retry; check network status |

### Contract Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `HostError: AuthFailed` | Missing auth | Add `authorize` for all required signers |
| `ContractNotInitialized` | `initialize` not called | Call `initialize` first |
| `StorageError` | Storage write failed | Check network, retry |
| `BudgetExceeded` | Compute too high | Optimize contract; increase fee |

## Wallet Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Wallet not connected` | No wallet selected | Prompt user to connect |
| `Wrong network` | Wallet on different network | Prompt network switch |
| `User rejected` | User cancelled | Handle gracefully; don't error |
| `Method not supported` | Wallet lacks feature | Check wallet capabilities |

## UI Errors

| Error | Cause | Solution |
|-------|-------|----------|
| Hydration mismatch | Server/client render diff | Use `useEffect` for client-only code |
| `useClient` missing | Component needs browser APIs | Add `"use client"` directive |
| State not updating | React closure stale | Use functional updates; check dependencies |

## Debugging Steps

### 1. Check Console

Open DevTools → Console for:
- SDK debug logs (enable with `Config.setLogLevel("debug")`)
- Network request/response
- React warnings

### 2. Inspect Network Tab

- RPC calls: `POST /` to `STELLAR_RPC_URL`
- Look for: 429 (rate limit), 5xx (server error), timeout

### 3. Verify Configuration

```bash
# Check env vars loaded
console.log(process.env.STELLAR_NETWORK);
console.log(process.env.STELLAR_RPC_URL);
```

### 4. Test RPC Directly

```bash
# Test RPC health
curl -X POST https://soroban-testnet.stellar.org \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}'
```

### 5. Test Transaction Flow

```typescript
// Minimal test in browser console
import { TransactionBuilder, Networks, BASE_FEE } from "@stellar/stellar-sdk";

const tx = new TransactionBuilder(account, {
  fee: BASE_FEE,
  networkPassphrase: Networks.TESTNET,
}).setTimeout(30).build();

console.log("XDR:", tx.toXDR());
```

## Getting Help

1. **Search issues** — [GitHub Issues](https://github.com/FeeBumpStudio/fee-bump-studio-app/issues)
2. **Check SDK docs** — [js-stellar-sdk](https://stellar.github.io/js-stellar-sdk/)
3. **Stellar Discord** — #developers channel
4. **File issue** — Include:
   - Error message + stack trace
   - Network (Testnet/Mainnet)
   - RPC URL (redacted)
   - Steps to reproduce
   - Browser/OS

## Related Documentation

- [Diagnostic Steps](diagnostic-steps.md)
- [Stellar SDK Integration](../api-reference/stellar-sdk.md)
- [Contract Interaction](../api-reference/contract-interaction.md)