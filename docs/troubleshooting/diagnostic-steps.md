# Diagnostic Steps

## Systematic Debugging Approach

### 1. Identify the Layer

```
┌─────────────────────────────────────────────────────────────┐
│                    USER REPORTS ISSUE                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  WHICH LAYER?                                               │
│  □ UI/React        □ Stellar SDK        □ Network/RPC      │
│  □ Wallet          □ Contract           □ Backend/API      │
└─────────────────────────────────────────────────────────────┘
```

### 2. Reproduce Locally

```bash
# Clone fresh
git clone https://github.com/FeeBumpStudio/fee-bump-studio-app.git
cd fee-bump-studio-app

# Install deps
npm install

# Use reporter's config (redacted)
cp .env.example .env.local
# Edit with same network/RPC/contract

# Run
npm run dev
```

### 3. Enable Debug Logging

```typescript
// Early in app initialization
import { Config } from "@stellar/stellar-sdk";
Config.setLogLevel("debug"); // Logs all RPC requests/responses
```

### 4. Capture Network Traffic

**Browser DevTools → Network tab:**
- Filter: `XHR` or `Fetch`
- Look for RPC calls to `STELLAR_RPC_URL`
- Save as HAR file for sharing

**Or use CLI:**
```bash
# Proxy RPC calls for inspection
mitmproxy --mode reverse:https://soroban-testnet.stellar.org -p 8080
# Then set STELLAR_RPC_URL=http://localhost:8080
```

### 5. Check Transaction Status

```typescript
// Given a transaction hash
async function diagnoseTransaction(hash: string) {
  const server = new rpc.Server(process.env.STELLAR_RPC_URL!);
  
  // 1. Get transaction result
  const result = await server.getTransaction(hash);
  console.log("Status:", result.status);
  console.log("Result codes:", result.resultCodes);
  console.log("Error XDR:", result.errorResultXdr);
  
  // 2. Get diagnostic events
  if (result.diagnosticEventsXdr) {
    const events = xdr.DiagnosticEvent.fromXDR(
      Buffer.from(result.diagnosticEventsXdr, "base64")
    );
    console.log("Events:", events);
  }
  
  // 3. Get ledger info
  if (result.ledger) {
    const ledger = await server.getLedger(result.ledger);
    console.log("Ledger:", ledger.sequence, ledger.closeTime);
  }
}
```

### 6. Simulate Before Submit

```typescript
// Always simulate contract calls first
async function safeSubmit(tx: Transaction, source: string) {
  const server = new rpc.Server(process.env.STELLAR_RPC_URL!);
  
  // 1. Simulate
  const simulation = await server.simulateTransaction(tx, { account: source });
  
  if (Api.isSimulationError(simulation)) {
    console.error("Simulation failed:", simulation.error);
    // Check events for contract errors
    if (simulation.events) {
      simulation.events.forEach(e => console.log("Event:", e));
    }
    throw new Error("Simulation failed");
  }
  
  // 2. Prepare with auth
  const prepared = await tx.prepare({ 
    authorize: simulation.results.map(r => r.auth) 
  });
  
  // 3. Sign and submit
  // ... wallet signing ...
  
  return prepared;
}
```

### 7. Verify Contract State

```typescript
// Read contract storage directly
async function checkContractState(contractId: string, actor: string) {
  const server = new rpc.Server(process.env.STELLAR_RPC_URL!);
  
  // Get contract data
  const data = await server.getContractData(contractId, {
    key: xdr.ScVal.scvAddress(new Address(actor).toScAddress()),
    type: "persistent",
  });
  
  console.log("Stored reference:", data.val);
}
```

## Diagnostic Checklists

### Transaction Submission Failure

- [ ] Account funded? (Check balance via RPC)
- [ ] Sequence number current? (Reload account)
- [ ] Fee sufficient? (Check `BASE_FEE` * operations)
- [ ] Timeout adequate? (30s+ for contract calls)
- [ ] All signers authorized? (Check `authorize` array)
- [ ] Simulation successful? (Run before submit)
- [ ] Network correct? (Testnet vs Mainnet)

### Contract Call Failure

- [ ] Contract deployed on target network?
- [ ] Contract initialized? (Admin called `initialize`)
- [ ] Function name correct? (Check ABI)
- [ ] Arguments properly encoded? (Check `ScVal` types)
- [ ] Auth entries match? (Each `require_auth` needs signature)
- [ ] Budget sufficient? (Increase fee if `BudgetExceeded`)

### Wallet Connection Issues

- [ ] Wallet extension installed?
- [ ] Wallet on correct network?
- [ ] Wallet supports required features?
- [ ] User approved connection?
- [ ] No other wallet conflicting?

### RPC/Network Issues

- [ ] RPC URL accessible? (curl test)
- [ ] RPC returns healthy? (`getHealth`)
- [ ] Rate limited? (Check headers, backoff)
- [ ] Network passphrase matches?
- [ ] Ledger syncing? (Check `getLatestLedger`)

## Log Analysis

### Structured Logging (Future)

```typescript
// lib/logger.ts
export const logger = {
  info: (msg: string, meta?: object) => 
    console.log(JSON.stringify({ level: "info", msg, ...meta, ts: Date.now() })),
  error: (msg: string, error: Error, meta?: object) => 
    console.error(JSON.stringify({ 
      level: "error", 
      msg, 
      error: error.message, 
      stack: error.stack, 
      ...meta, 
      ts: Date.now() 
    })),
};

// Usage
logger.info("Transaction submitted", { hash, network: "testnet" });
logger.error("Submission failed", error, { hash, network: "testnet" });
```

### Log Queries (If Aggregated)

```sql
-- Find failed transactions in last hour
SELECT * FROM logs 
WHERE level = 'error' 
  AND msg LIKE '%transaction%' 
  AND ts > now() - interval '1 hour';

-- Count errors by type
SELECT error->>'message' as error_type, COUNT(*)
FROM logs 
WHERE level = 'error' 
GROUP BY error_type 
ORDER BY COUNT(*) DESC;
```

## Performance Diagnostics

### Bundle Analysis

```bash
ANALYZE=true npm run build
# Opens browser with bundle visualization
```

### Runtime Performance

```typescript
// Measure RPC latency
const start = performance.now();
const result = await server.getTransaction(hash);
const latency = performance.now() - start;
logger.info("RPC latency", { method: "getTransaction", latencyMs: latency });
```

### React Profiling

```bash
# In browser DevTools
# 1. Profiler tab
# 2. Record interaction
# 3. Look for unnecessary re-renders
```

## Escalation Path

| Level | When | Action |
|-------|------|--------|
| **Self-service** | Common error | Check docs, search issues |
| **Community** | Unclear error | Discord, GitHub Discussions |
| **Maintainer** | Bug in code | GitHub Issue with reproduction |
| **Security** | Vulnerability | Private disclosure (SECURITY.md) |

## Related Documentation

- [Common Errors](common-errors.md)
- [Stellar SDK Integration](../api-reference/stellar-sdk.md)
- [Security - Responsible Disclosure](../security/responsible-disclosure.md)