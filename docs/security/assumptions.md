# Security Assumptions

## Threat Model

### Assumptions

| Assumption | Justification |
|------------|---------------|
| **User controls their wallet** | Private keys never leave wallet extension |
| **RPC endpoint is trusted** | TLS + known provider; MITM would require CA compromise |
| **Contract code is as deployed** | Immutable baseline; verify via source verification |
| **Browser is not compromised** | Standard web security model |
| **Network (Testnet/Mainnet) operates correctly** | Byzantine fault tolerance of Stellar consensus |

### Trust Boundaries

```
┌─────────────────────────────────────────────────────────────┐
│                        USER DEVICE                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   Browser    │  │  Wallet Ext  │  │  FeeBumpStudio   │  │
│  │  (Untrusted) │◄─┤  (Trusted)   │  │  App (Untrusted) │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                    │                    │
         HTTPS/TLS  │                    │  Wallet API
                    ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                      NETWORK                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  RPC Node    │  │  Stellar     │  │  Contract        │  │
│  │  (Trusted*)  │◄─┤  Network     │◄─┤  (Immutable)     │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND                                 │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │  Indexer     │  │  Operational │                         │
│  │  (Trusted)   │  │  DB (Trusted)│                         │
│  └──────────────┘  └──────────────┘                         │
└─────────────────────────────────────────────────────────────┘
```

* RPC trust assumes correct configuration and reputable provider

## Security Properties

### Confidentiality

- **Private keys**: Never in app; held by wallet
- **Secrets**: Server-only (RPC auth, DB credentials)
- **User data**: Minimal; no PII collected

### Integrity

- **Transactions**: User reviews before signing
- **Contract state**: Verifiable on-chain
- **Backend data**: Indexed from network; auditable

### Availability

- **App**: Static hosting; CDN distributed
- **RPC**: Provider SLA (or self-hosted redundancy)
- **Network**: Stellar consensus (99.9%+ uptime)

## Attack Surface Analysis

### Client-Side (Browser)

| Vector | Mitigation |
|--------|------------|
| XSS | React auto-escaping; CSP headers |
| Malicious transaction | Explicit user review; simulation |
| Supply chain | `npm audit`; pinned dependencies |
| Clipboard hijacking | No auto-copy of secrets |

### Network Layer

| Vector | Mitigation |
|--------|------------|
| RPC MITM | TLS + certificate pinning (future) |
| RPC manipulation | Simulation verifies result |
| Fee manipulation | User sees fee before signing |

### Contract Layer

| Vector | Mitigation |
|--------|------------|
| Reentrancy | No external calls in baseline |
| Authorization bypass | `require_auth` on all state changes |
| Storage exhaustion | Bounded string size |
| Upgrade attack | Immutable (baseline) |

### Backend Layer

| Vector | Mitigation |
|--------|------------|
| SQL injection | Parameterized queries (when DB added) |
| Auth bypass | API key / JWT validation |
| Data tampering | Append-only indexer; reconciliation |
| DoS | Rate limiting; request validation |

## Cryptographic Assumptions

| Primitive | Algorithm | Source |
|-----------|-----------|--------|
| Signatures | Ed25519 | Stellar SDK / Wallet |
| Hashing | SHA-256 | Stellar SDK |
| Key derivation | PBKDF2 (wallet) | Wallet implementation |
| TLS | X25519 + AES-GCM | Browser / Node.js |

## Compliance Considerations

| Regulation | Applicability | Approach |
|------------|---------------|----------|
| GDPR | No PII collected | N/A |
| SOC2 | Not certified | Document controls |
| PCI DSS | No payments | N/A |

## Future Hardening

- [ ] Content Security Policy headers
- [ ] Subresource Integrity for CDN assets
- [ ] RPC certificate pinning
- [ ] Contract upgradeability with timelock
- [ ] Formal verification of contract logic
- [ ] Penetration testing before Mainnet

## Related Documentation

- [Responsible Disclosure](responsible-disclosure.md)
- [Known Limitations](limitations.md)
- [Architecture - Security Boundaries](../developer-guide/architecture.md#security-boundaries)