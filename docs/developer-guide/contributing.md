# Contributing

## Before You Start

1. **Read the README** — Understand the project purpose and status
2. **Run the project locally** — Verify your environment works
3. **Check existing issues** — Avoid duplicate work
4. **Read this guide** — Follow the workflow

## Development Setup

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/fee-bump-studio-app.git
cd fee-bump-studio-app

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your Testnet config

# Verify
npm run typecheck
npm run dev
```

## Contribution Workflow

### 1. Find or Create an Issue

- Check [GitHub Issues](https://github.com/FeeBumpStudio/fee-bump-studio-app/issues)
- Look for `good first issue`, `help wanted` labels
- Create new issue if needed — describe problem and proposed solution

### 2. Create a Branch

```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 3. Make Changes

- Keep changes focused and atomic
- Follow code style (TypeScript strict, React best practices)
- Update documentation for user-facing changes
- Add tests for new functionality

### 4. Validate Locally

```bash
# Type-check
npm run typecheck

# Build
npm run build

# Run tests (when available)
npm test
```

### 5. Commit

```bash
git add .
git commit -m "feat: add transaction inspection view

- Add TransactionInspector component
- Integrate with Stellar SDK for XDR parsing
- Update user guide with inspection workflow"
```

**Commit Message Format:**
```
<type>: <short description>

<body with details>

Fixes #<issue-number>
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `style`

### 6. Push and Open PR

```bash
git push origin feature/your-feature-name
```

Open PR against `main` branch. Fill out the PR template.

## Code Review Guidelines

### For Authors

- Keep PRs small (< 400 lines changed)
- Self-review before requesting review
- Respond to feedback promptly
- Update docs/tests with changes

### For Reviewers

- Check: correctness, style, tests, docs, security
- Be constructive and specific
- Approve when ready, request changes when needed

## Code Standards

### TypeScript

- **Strict mode** — No `any`, explicit types
- **Interfaces over types** for object shapes
- **Enums** for fixed value sets
- **Generics** for reusable components

### React

- **Server Components** by default
- **Client Components** only with `"use client"`
- **Hooks** for stateful logic
- **Context** for global state (network, wallet)

### Stellar Operations

- **Never log secrets** — No private keys, signatures in logs
- **Validate inputs** — Check XDR, addresses, amounts
- **Handle errors** — User-friendly messages, preserve context
- **Test on Testnet** — Verify before Mainnet considerations

### Security

- **No credentials in code** — Use environment variables
- **No mainnet in CI** — Testnet only for automated tests
- **Audit dependencies** — `npm audit` before merging
- **Report vulnerabilities** — See [SECURITY.md](../../SECURITY.md)

## Documentation Updates

When adding features, update:

- [ ] Relevant user guide page
- [ ] API reference if new endpoints/functions
- [ ] Configuration if new env vars
- [ ] FAQ if common questions arise
- [ ] CHANGELOG (if maintained)

## Release Process

1. Maintainer creates release branch
2. Version bump in `package.json`
3. Changelog updated
4. Tagged release `vX.Y.Z`
5. GitHub Actions builds and deploys

## Getting Help

- **Discord/GitHub Discussions** — Design questions, architecture
- **GitHub Issues** — Bugs, feature requests
- **Security** — Private disclosure per [SECURITY.md](../../SECURITY.md)

## Recognition

Contributors are recognized in:

- Release notes
- Contributors list (future)
- Project documentation

Thank you for contributing to FeeBumpStudio!