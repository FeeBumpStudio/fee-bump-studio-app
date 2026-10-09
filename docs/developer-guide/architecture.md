# Architecture

## High-Level Architecture

```mermaid
flowchart TB
    subgraph Client["fee-bump-studio-app (Browser)"]
        UI[Next.js App Router]
        SDK[@stellar/stellar-sdk]
        Wallet[Wallet Adapter]
        State[React State / Context]
    end
    
    subgraph Backend["fee-bump-studio-backend"]
        API[HTTP API :8080]
        Indexer[Stellar Ingestion]
        DB[(Operational DB)]
    end
    
    subgraph Contracts["fee-bump-studio-contracts"]
        Soroban[Soroban Contract]
        Events[Contract Events]
    end
    
    subgraph Network["Stellar Network"]
        RPC[Soroban RPC]
        Ledger[(Ledger State)]
    end
    
    UI --> SDK
    UI --> Wallet
    UI --> State
    SDK --> RPC
    Wallet --> RPC
    UI --> API
    API --> Indexer
    API --> DB
    Indexer --> RPC
    Indexer --> Soroban
    Soroban --> Ledger
    RPC --> Ledger
    Events -.-> Indexer
```

## Design Principles

| Principle | Implementation |
|-----------|----------------|
| **No Server Secrets in Browser** | All RPC/config via env vars; backend holds credentials |
| **Explicit Over Implicit** | Every network action shown before wallet prompt |
| **Verifiable Settlement** | Stellar as truth source; off-chain for indexing/UX |
| **Minimal Contract Surface** | Contracts only for verifiable state transitions |
| **Idempotent Operations** | Retry-safe backend processing |

## Data Flow

### Read Path (User Views Transaction)

```
User → App UI → Stellar SDK → RPC → Ledger
                    ↓
              Backend API ← Indexer ← DB
```

### Write Path (User Submits Fee Bump)

```
User → App UI → Wallet → Signed Envelope → RPC → Ledger
                    ↓
              Backend API (async indexing)
```

## Component Responsibilities

### fee-bump-studio-app (This Repo)

- User interface and workflow orchestration
- Transaction construction (XDR)
- Wallet integration
- Network configuration management
- Local state and history

### fee-bump-studio-backend

- HTTP API for app consumption
- Stellar data ingestion and normalization
- Operational data persistence
- Scheduled jobs and reconciliation
- Observability and diagnostics

### fee-bump-studio-contracts

- On-chain state transitions
- Authorization enforcement
- Event emission for indexing
- Deterministic protocol logic

## Technology Choices

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Frontend Framework** | Next.js 15 (App Router) | React 19, Server Components, TypeScript |
| **Chain SDK** | @stellar/stellar-sdk 17.2.1 | Official, maintained, full feature coverage |
| **Language** | TypeScript | Type safety for XDR, transactions, config |
| **Styling** | None (baseline) / Tailwind (planned) | Minimal baseline, utility-first for production |
| **State** | React Context + useReducer | Simple, no external deps |
| **Build** | Next.js static export | Deploy anywhere, no Node runtime needed |

## Security Boundaries

```
┌─────────────────────────────────────────────────────────────┐
│                      BROWSER (Untrusted)                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ UI Components│  │ Transaction │  │ Wallet Connection   │  │
│  │  (React)    │  │ Construction│  │  (Freighter, etc.)  │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│         │               │                    │               │
│         └───────────────┼────────────────────┘               │
│                         ▼                                    │
│              ┌─────────────────────┐                         │
│              │  Public Config Only │                         │
│              │  (Network, RPC,     │                         │
│              │   Contract ID)      │                         │
│              └─────────────────────┘                         │
└─────────────────────────────────────────────────────────────┘
                          │ HTTPS
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Trusted)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ HTTP API    │  │ Indexer     │  │ Secrets (RPC, DB)   │  │
│  │ (Node.js)   │  │ (Ingestion) │  │ (Server-only)       │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Future Architecture Evolution

- **Wallet Abstraction** — Unified interface for multiple wallet providers
- **Offline Support** — Service worker for read-only caching
- **Real-time Updates** — WebSocket/SSE from backend for live status
- **Multi-network** — Simultaneous Testnet/Mainnet contexts