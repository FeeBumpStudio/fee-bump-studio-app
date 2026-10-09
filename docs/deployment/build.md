# Build

## Production Build

```bash
npm run build
```

This runs:
1. TypeScript compilation (`tsc`)
2. Next.js production build
3. Static page generation (where possible)
4. Bundle optimization

## Build Output

```
.next/
├── static/           # Static assets (JS, CSS, images)
├── server/           # Server-side code (if SSR used)
└── BUILD_ID         # Unique build identifier
```

## Build Configuration

### Next.js Config (Future)

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',  // For container deployment
  images: {
    domains: ['stellar.expert', 'cdn.stellar.org'],
  },
  env: {
    NEXT_PUBLIC_STELLAR_NETWORK: process.env.STELLAR_NETWORK,
  },
};

module.exports = nextConfig;
```

### TypeScript Config

```json
// tsconfig.ci.json (used in CI)
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## Build Verification

```bash
# 1. Type-check
npm run typecheck

# 2. Build
npm run build

# 3. Verify output
ls -la .next/
```

## Build Optimization

| Optimization | Status |
|--------------|--------|
| **Code splitting** | Automatic (Next.js) |
| **Tree shaking** | Automatic (ESM) |
| **Minification** | Automatic (swc) |
| **Compression** | Automatic (gzip/brotli) |
| **Bundle analysis** | `ANALYZE=true npm run build` |

## CI Build

The GitHub Actions workflow runs:

```yaml
# .github/workflows/ci.yml
- name: Type-check
  run: npm run typecheck
- name: Build
  run: npm run build
```

## Build for Different Environments

### Development

```bash
npm run dev
# Uses .env.local, hot reload, no optimization
```

### Staging

```bash
STELLAR_NETWORK=testnet \
STELLAR_RPC_URL=https://staging-rpc.example.com \
STELLAR_CONTRACT_ID=CABC...STAGING \
npm run build
```

### Production

```bash
STELLAR_NETWORK=mainnet \
STELLAR_RPC_URL=https://rpc.stellar.org/prod-project \
STELLAR_CONTRACT_ID=CXYZ...MAINNET \
npm run build
```

## Docker Build (Optional)

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

## Build Artifacts

| Artifact | Purpose |
|----------|---------|
| `.next/` | Next.js build output |
| `package-lock.json` | Dependency lockfile |
| `Docker image` | Container deployment (optional) |

## Troubleshooting Build Failures

| Error | Solution |
|-------|----------|
| TypeScript errors | Run `npm run typecheck` for details |
| Out of memory | `NODE_OPTIONS="--max-old-space-size=4096" npm run build` |
| Module not found | Check imports, run `npm install` |
| RPC/Contract errors | Build doesn't connect to network; check config only |

## Related Documentation

- [Hosting Options](hosting.md)
- [Environment Setup](environment-setup.md)
- [Release Procedures](release.md)