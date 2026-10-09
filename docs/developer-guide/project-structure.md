# Project Structure

```
fee-bump-studio-app/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout (minimal)
│   └── page.tsx           # Home page (baseline screen)
├── assets/                # Static assets
│   ├── banner.svg         # Documentation banner
│   └── logo.svg           # Project logo
├── docs/                  # Documentation source (MkDocs)
│   ├── index.md
│   ├── getting-started/
│   ├── user-guide/
│   ├── developer-guide/
│   ├── api-reference/
│   ├── configuration/
│   ├── deployment/
│   ├── troubleshooting/
│   ├── security/
│   └── faq.md
├── public/                # Next.js public assets (future)
├── .github/
│   ├── workflows/
│   │   └── ci.yml         # CI: typecheck, build, doc validation
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE/
├── .env.example           # Environment template
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.ci.json       # TypeScript config for CI
├── README.md
├── LICENSE
├── CONTRIBUTING.md
├── SECURITY.md
├── CODE_OF_CONDUCT.md
├── CODEOWNERS
└── mkdocs.yml             # MkDocs configuration
```

## Key Files

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root HTML structure, providers |
| `app/page.tsx` | Baseline home screen |
| `tsconfig.ci.json` | Strict TypeScript config for CI |
| `.env.example` | Environment variable template |
| `mkdocs.yml` | Documentation site configuration |
| `.github/workflows/ci.yml` | CI pipeline |

## Planned Structure (As Features Grow)

```
app/
├── (dashboard)/          # Route group for authenticated pages
│   ├── layout.tsx       # Dashboard layout with nav
│   ├── page.tsx         # Dashboard overview
│   ├── transactions/    # Transaction list & detail
│   ├── contracts/       # Contract interaction
│   └── settings/        # User preferences
├── api/                 # API routes (if needed)
│   └── health/          # Health check endpoint
├── components/          # Shared React components
│   ├── ui/              # Primitive components
│   ├── wallet/          # Wallet connection UI
│   └── transaction/     # Transaction display components
├── lib/                 # Core utilities
│   ├── stellar/         # Stellar SDK helpers
│   ├── config/          # Environment config
│   └── utils/           # General utilities
├── hooks/               # Custom React hooks
│   ├── useNetwork.ts
│   ├── useWallet.ts
│   └── useTransactions.ts
├── types/               # TypeScript definitions
│   ├── stellar.ts
│   └── api.ts
└── providers/           # React Context providers
    ├── NetworkProvider.tsx
    ├── WalletProvider.tsx
    └── TransactionProvider.tsx
```

## Configuration Files

| File | Description |
|------|-------------|
| `package.json` | Dependencies, scripts, metadata |
| `tsconfig.json` | TypeScript config (extends tsconfig.ci.json) |
| `next.config.js` | Next.js configuration (future) |
| `tailwind.config.ts` | Tailwind CSS config (planned) |
| `.eslintrc.js` | ESLint config (planned) |
| `jest.config.ts` | Jest config for unit tests (planned) |

## Documentation Structure

```
docs/
├── index.md                    # Home page
├── getting-started/            # Prerequisites, install, config, first run
├── user-guide/                 # Feature workflows
├── developer-guide/            # Architecture, structure, dev workflow
├── api-reference/              # SDK, contract, backend APIs
├── configuration/              # Env vars, network settings
├── deployment/                 # Build, hosting, release
├── troubleshooting/            # Errors, diagnostics
├── security/                   # Disclosure, assumptions, limitations
├── faq.md                      # Frequently asked questions
├── stylesheets/extra.css       # Custom styles
└── javascripts/mermaid.js      # Mermaid diagram support
```