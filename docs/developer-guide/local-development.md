# Local Development

## Development Workflow

```bash
# 1. Start development server
npm run dev

# 2. In another terminal, run type-check
npm run typecheck -- --watch

# 3. Make changes to app/, components/, lib/

# 4. Verify build passes
npm run build
```

## Available Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `next dev` | Start dev server with hot reload |
| `build` | `next build` | Production build (type-checks) |
| `start` | `next start` | Serve production build |
| `typecheck` | `tsc -p tsconfig.ci.json` | TypeScript validation |

## Development Server

- **URL**: `http://localhost:3000` (or `PORT` from `.env.local`)
- **Hot Reload**: Enabled for all `app/` changes
- **Type Checking**: Runs in background (Next.js 15)

## Environment Setup

### Required `.env.local`

```ini
STELLAR_NETWORK=testnet
STELLAR_RPC_URL=https://soroban-testnet.stellar.org
STELLAR_CONTRACT_ID=CABC...YOUR_TESTNET_CONTRACT
PORT=3000
```

### Optional Development Tools

```bash
# Install Stellar CLI for contract development
cargo install --locked stellar-cli

# Install Soroban CLI (if working on contracts)
# See: https://developers.stellar.org/docs/tools/cli/stellar-cli
```

## Code Style

### TypeScript

- **Strict mode** enabled via `tsconfig.ci.json`
- **No `any`** — Use proper types from `@stellar/stellar-sdk`
- **Explicit returns** for async functions

### React

- **Function components** with hooks
- **Server Components** by default (Next.js 15)
- **Client Components** only when needed (`"use client"`)

### Stellar SDK Usage

```typescript
// Good: Explicit types
import { Transaction, Operation, Networks } from "@stellar/stellar-sdk";

const tx = new TransactionBuilder(account, {
  fee: BASE_FEE,
  networkPassphrase: Networks.TESTNET,
})
  .addOperation(Operation.payment({ ... }))
  .setTimeout(30)
  .build();

// Avoid: Implicit any
const tx = new TransactionBuilder(account, { fee: "100000" })
  .addOperation(Op.payment({ ... }))
  .build();
```

## Debugging

### Browser DevTools

- **React DevTools** — Component inspection
- **Network Tab** — RPC requests, API calls
- **Console** — SDK logs, errors

### Stellar-Specific Debugging

```typescript
// Enable debug logging
import { Config } from "@stellar/stellar-sdk";
Config.setLogLevel("debug");

// Inspect XDR
console.log("Transaction XDR:", tx.toXDR());
console.log("Envelope XDR:", envelope.toXDR());
```

### Common Debug Scenarios

| Issue | Debug Approach |
|-------|----------------|
| Transaction fails | Check `txResult` codes, diagnostic events |
| Contract error | Use `simulateTransaction` first |
| RPC timeout | Check network tab, try different RPC |
| Wallet not connecting | Verify wallet extension, network match |

## Testing

### Current Test Setup

```bash
# Type-check (acts as compile-time test)
npm run typecheck

# Build verification
npm run build
```

### Planned Test Structure

```
tests/
├── unit/              # Jest + React Testing Library
│   ├── components/
│   ├── hooks/
│   └── lib/
├── integration/       # Playwright or Cypress
│   ├── transaction-flow.test.ts
│   └── wallet-connection.test.ts
└── e2e/               # Full workflow tests
    └── fee-bump-flow.test.ts
```

## Git Workflow

```bash
# 1. Create feature branch
git checkout -b feature/your-feature

# 2. Make changes, commit
git add .
git commit -m "feat: your feature description"

# 3. Push and open PR
git push origin feature/your-feature

# 4. CI runs: typecheck, build, doc validation
# 5. Review, merge to main
```

## Pre-commit Checks (Recommended)

Install husky for local validation:

```bash
npm install --save-dev husky
npx husky install
npx husky add .husky/pre-commit "npm run typecheck"
```

## Performance Profiling

```bash
# Next.js bundle analysis
ANALYZE=true npm run build

# React DevTools Profiler
# Record interactions, identify re-renders
```

## Useful Commands

```bash
# Clean build cache
rm -rf .next && npm run build

# Check for unused dependencies
npx depcheck

# Audit dependencies
npm audit

# Update dependencies
npm update
```