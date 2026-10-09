# Testing

## Current Test Status

The baseline repository has minimal test infrastructure:

```bash
# Type-check (compile-time verification)
npm run typecheck

# Build verification (includes type-check)
npm run build
```

## Test Strategy

| Layer | Tool | Scope |
|-------|------|-------|
| **Type Safety** | TypeScript | All code (enforced in CI) |
| **Unit Tests** | Jest + RTL | Components, hooks, utilities |
| **Integration** | Playwright | Wallet flows, transaction flows |
| **Contract Tests** | `cargo test` | In `fee-bump-studio-contracts` |
| **Backend Tests** | `node --test` | In `fee-bump-studio-backend` |

## Running Tests

### Type Checking

```bash
npm run typecheck
# Or with watch mode
npx tsc -p tsconfig.ci.json --watch
```

### Future: Unit Tests

```bash
# After Jest setup
npm test              # Run all unit tests
npm test -- --watch   # Watch mode
npm test -- --coverage # Coverage report
```

### Future: E2E Tests

```bash
# After Playwright setup
npx playwright install
npm run test:e2e
```

## Test Patterns

### Component Testing (Planned)

```typescript
// tests/components/TransactionCard.test.tsx
import { render, screen } from "@testing-library/react";
import { TransactionCard } from "@/components/transaction/TransactionCard";

describe("TransactionCard", () => {
  it("displays transaction hash and status", () => {
    render(<TransactionCard tx={mockTx} />);
    expect(screen.getByText(/a1b2c3/i)).toBeInTheDocument();
    expect(screen.getByText(/confirmed/i)).toBeInTheDocument();
  });
});
```

### Hook Testing (Planned)

```typescript
// tests/hooks/useNetwork.test.ts
import { renderHook, act } from "@testing-library/react";
import { useNetwork } from "@/hooks/useNetwork";

describe("useNetwork", () => {
  it("returns current network from context", () => {
    const { result } = renderHook(() => useNetwork(), {
      wrapper: NetworkProvider,
    });
    expect(result.current.network).toBe("testnet");
  });
});
```

### Stellar SDK Testing (Planned)

```typescript
// tests/lib/stellar/fee-estimation.test.ts
import { estimateFeeBump } from "@/lib/stellar/fee-estimation";

describe("estimateFeeBump", () => {
  it("returns fee > inner fee", () => {
    const innerFee = 1_000_000n;
    const estimate = estimateFeeBump(innerFee, { mode: "recommended" });
    expect(estimate.recommendedFee).toBeGreaterThan(innerFee);
  });
});
```

## CI Integration

The GitHub Actions workflow runs:

```yaml
# .github/workflows/ci.yml
- name: Type-check
  run: npm run typecheck
- name: Build
  run: npm run build
# Future:
- name: Test
  run: npm test
- name: E2E
  run: npm run test:e2e
```

## Test Coverage Goals

| Area | Target |
|------|--------|
| **Components** | ≥ 80% |
| **Hooks** | ≥ 90% |
| **Stellar Helpers** | ≥ 95% |
| **Critical Paths** | 100% (fee-bump, wallet, submission) |

## Mocking Strategy

| Dependency | Mock Approach |
|------------|---------------|
| `@stellar/stellar-sdk` | Mock classes, fixed XDR responses |
| Wallet Adapters | Mock provider with controlled state |
| RPC Calls | MSW (Mock Service Worker) or fixtures |
| Backend API | MSW with OpenAPI schema |

## Debugging Tests

```bash
# Verbose output
npm test -- --verbose

# Single test file
npm test -- TransactionCard.test.tsx

# Debug in VS Code
# Add "debug.jest.autoAttach": true to settings.json
```

## Related Documentation

- [Local Development](local-development.md)
- [Contributing](contributing.md)
- [CI Workflow](../configuration/ci-cd.md)