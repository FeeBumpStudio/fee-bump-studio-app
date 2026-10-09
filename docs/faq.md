# Frequently Asked Questions

## General

### What is FeeBumpStudio?

FeeBumpStudio is a developer toolkit for preparing Stellar fee-bump transactions with full transparency. It helps you inspect transactions, estimate replacement fees, and prepare fee-bump envelopes while keeping the original transaction intent visible for review.

### Is this production-ready?

**No.** This is a development baseline (v0.1.0). It is **not audited** and **not production-ready**. Do not use with mainnet funds or production credentials.

### Who maintains this?

**Jubilee** ([@Jubilee-001](https://github.com/Jubilee-001)).

### Where is the source code?

- **App**: https://github.com/FeeBumpStudio/fee-bump-studio-app
- **Backend**: https://github.com/FeeBumpStudio/fee-bump-studio-backend
- **Contracts**: https://github.com/FeeBumpStudio/fee-bump-studio-contracts

## Getting Started

### Do I need a Stellar account to use the app?

For the baseline UI: **No** — it runs without network connection.

For full functionality: **Yes** — you need a Testnet account (funded via [Friendbot](https://laboratory.stellar.org/#account-creator?network=testnet)) and a wallet extension (Freighter, Albedo, or Rabet).

### Which wallet should I use?

Supported wallets (planned):
- **Freighter** — Most popular, browser extension
- **Albedo** — Open source, browser extension
- **Rabet** — Multi-chain, browser extension

### Why Testnet by default?

Testnet is free, resets periodically, and is safe for development. Mainnet requires real XLM and dedicated RPC.

## Technical

### What's the tech stack?

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Stellar**: @stellar/stellar-sdk 17.2.1
- **Contracts**: Rust + Soroban SDK 28
- **Backend**: Node.js (built-in http)

### How does fee-bump work?

A fee-bump transaction wraps an inner transaction and replaces its fee with a higher amount. The fee source (which can be different from the inner transaction's source) pays the bump fee and must sign. Original signatures are preserved.

### Can I use this with any Stellar transaction?

Yes, fee-bump works with any transaction type (payments, contract calls, etc.) as long as the network supports protocol v20+.

### What's the contract for?

The Soroban contract (`FeeBumpStudioContract`) provides minimal on-chain state for verifiable fee-bump event recording. It stores references authorized by actors. The app and backend handle the complex workflow; the contract proves the event happened.

## Configuration

### Where do I get a contract ID?

Deploy the contract from `fee-bump-studio-contracts`:
```bash
cd fee-bump-studio-contracts
make build
# Deploy via stellar CLI
```

### Why do I need a dedicated RPC for Mainnet?

There is **no public Mainnet RPC**. You must use a provider (Stellar RPC, QuickNode, Blockdaemon, or self-hosted).

### Can I run without a contract?

Yes, the baseline UI works without `STELLAR_CONTRACT_ID`. Contract features will be disabled.

## Troubleshooting

### "Network mismatch" error

Your `STELLAR_NETWORK` (testnet/mainnet) doesn't match the RPC endpoint. Ensure both point to the same network.

### "Contract not found"

The `STELLAR_CONTRACT_ID` doesn't exist on the target network. Deploy the contract on that network and update the ID.

### "Insufficient balance"

Your account needs XLM for fees. On Testnet, use [Friendbot](https://laboratory.stellar.org/#account-creator?network=testnet). On Mainnet, acquire XLM from an exchange.

### Transaction times out

The transaction may still succeed. Check status via hash on [Stellar Expert](https://stellar.expert) or via RPC `getTransaction`.

### Wallet won't connect

- Ensure wallet extension is installed
- Check wallet is on correct network (Testnet/Mainnet)
- Try refreshing the page
- Check browser console for errors

## Contributing

### How can I contribute?

1. Check [GitHub Issues](https://github.com/FeeBumpStudio/fee-bump-studio-app/issues)
2. Look for `good first issue` labels
3. Fork, create branch, make changes
4. Open PR with description

### What's the development setup?

```bash
git clone https://github.com/FeeBumpStudio/fee-bump-studio-app.git
cd fee-bump-studio-app
npm install
cp .env.example .env.local
npm run dev
```

### Are there coding standards?

- TypeScript strict mode
- React Server Components by default
- ESLint + Prettier (planned)
- Conventional commits

## Deployment

### Can I deploy to Vercel?

Yes, the app is designed for Vercel. Connect your GitHub repo and configure environment variables.

### Can I run in Docker?

Yes, a `Dockerfile` with `output: 'standalone'` works. See [Hosting Options](../deployment/hosting.md).

### What about Kubernetes?

See [Kubernetes example](../deployment/hosting.md#kubernetes-example) in hosting docs.

## Security

### Is my private key safe?

**Yes** — the app never sees your private key. Wallets sign transactions in their secure context. The app only constructs XDR and submits signed envelopes.

### What if I find a vulnerability?

Report privately via [GitHub Security Advisories](https://github.com/FeeBumpStudio/fee-bump-studio-app/security/advisories/new). See [Responsible Disclosure](../security/responsible-disclosure.md).

## Roadmap

### What's next?

See the [README Roadmap](https://github.com/FeeBumpStudio/fee-bump-studio-app/blob/main/README.md#roadmap):

1. Wallet connection
2. Transaction inspection
3. Fee estimation
4. Fee-bump preparation
5. History/events
6. Tests and CI/CD

### When will v1.0 release?

No fixed timeline. Depends on community contributions and audit completion.

## Still Have Questions?

- **GitHub Discussions** — Design questions, architecture
- **GitHub Issues** — Bugs, feature requests
- **Discord** — Community chat (if available)
- **Email** — security@feebumpstudio.example.com (security only)