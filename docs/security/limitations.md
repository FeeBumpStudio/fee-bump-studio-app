# Known Limitations

## Current Baseline Limitations

### Functionality

| Limitation | Impact | Planned Resolution |
|------------|--------|-------------------|
| **No wallet connection** | Cannot sign transactions | Integrate Freighter/Albedo/Rabet adapters |
| **No transaction inspection** | Cannot parse XDR | Build TransactionInspector component |
| **No fee estimation** | Manual fee entry | Integrate backend fee stats + simulation |
| **No fee-bump preparation** | Core feature missing | Build FeeBumpBuilder workflow |
| **No history/events** | No audit trail | Integrate backend indexer API |
| **Single page only** | No navigation | Add App Router routes for features |

### Technical

| Limitation | Impact | Planned Resolution |
|------------|--------|-------------------|
| **No tests** | No regression protection | Add Jest + Playwright |
| **No linting** | Inconsistent code style | Add ESLint + Prettier |
| **No CI/CD for deploy** | Manual deployment | GitHub Actions → Vercel/container |
| **No monitoring** | No production visibility | Health endpoint + logging |
| **No error boundaries** | Crashes break entire app | React error boundaries |
| **No loading states** | Poor UX during RPC calls | Suspense + loading components |

### Security

| Limitation | Impact | Planned Resolution |
|------------|--------|-------------------|
| **No CSP headers** | XSS risk | Add strict CSP |
| **No rate limiting** | DoS risk | Backend rate limits; client backoff |
| **No audit** | Unknown vulnerabilities | Third-party audit before Mainnet |
| **Immutable contract** | Cannot fix bugs | Upgradeable proxy pattern |

### Operational

| Limitation | Impact | Planned Resolution |
|------------|--------|-------------------|
| **Testnet only** | No Mainnet readiness | Mainnet deployment pipeline |
| **No backup strategy** | Data loss risk | Document backup procedures |
| **No runbook** | Slow incident response | Create OPERATIONS.md |
| **Single maintainer** | Bus factor | Grow contributor base |

## Architecture Limitations

### Scalability

| Area | Current | Limit | Future |
|------|---------|-------|--------|
| **Concurrent users** | 1 (local) | N/A | Stateless; horizontal scaling |
| **RPC calls** | Direct | Rate limited | Backend proxy + caching |
| **Contract calls** | Sequential | Slow | Batch simulation; parallel |

### Maintainability

| Area | Current | Risk |
|------|---------|------|
| **Type coverage** | Partial | Runtime errors possible |
| **Documentation** | Baseline only | Drift from implementation |
| **Dependency updates** | Manual | Security drift |

## Network-Specific Limitations

### Testnet

- **Rate limits** — 100 req/min on public RPC
- **Ledger reset** — Periodic; accounts/contracts wiped
- **No SLA** — Not for production workloads

### Mainnet (Future)

- **Cost** — Real XLM for fees
- **Finality** — ~5s ledger close; wait for confirmations
- **Regulatory** — Consider jurisdiction requirements

## Dependency Risks

| Dependency | Risk | Mitigation |
|------------|------|------------|
| `@stellar/stellar-sdk` | Breaking changes | Pin version; test upgrades |
| `next` | Major version changes | Lock major; planned upgrades |
| `react` | Concurrent features | Test with each release |
| Wallet APIs | Inconsistent implementations | Abstraction layer; feature detection |

## Upgrade Path

### From Baseline to Production

```
v0.1.0 (baseline)
    │
    ├─► v0.2.0: Wallet connection + basic UI
    │
    ├─► v0.3.0: Transaction inspection + fee estimation
    │
    ├─► v0.4.0: Fee-bump preparation + submission
    │
    ├─► v0.5.0: History + backend integration
    │
    ├─► v0.6.0: Tests + CI/CD + monitoring
    │
    ├─► v0.7.0: Security hardening + audit prep
    │
    └─► v1.0.0: Production release (post-audit)
```

## Acceptable Use

This baseline is **only suitable for**:

- Local development and testing
- Testnet experimentation
- Architecture evaluation
- Contributor onboarding

**Not suitable for**:

- Mainnet funds
- Production workloads
- User-facing demos without disclaimers
- Compliance-required environments

## Related Documentation

- [Roadmap](https://github.com/FeeBumpStudio/fee-bump-studio-app/blob/main/README.md#roadmap)
- [Security Assumptions](assumptions.md)
- [Responsible Disclosure](responsible-disclosure.md)
- [Architecture](../developer-guide/architecture.md)