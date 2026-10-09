# Environment Setup

## Production Environment Checklist

### Required Configuration

| Variable | Production Value | Notes |
|----------|------------------|-------|
| `STELLAR_NETWORK` | `mainnet` | Must be mainnet for production |
| `STELLAR_RPC_URL` | Dedicated endpoint | No public mainnet RPC |
| `STELLAR_CONTRACT_ID` | Mainnet contract ID | Deployed separately from Testnet |
| `PORT` | `3000` (or 80/443 behind proxy) | Internal port |

### Security Configuration

```ini
# .env.production
STELLAR_NETWORK=mainnet
STELLAR_RPC_URL=https://rpc.stellar.org/your-production-project
STELLAR_CONTRACT_ID=CXYZ789...YOUR_MAINNET_CONTRACT
PORT=3000

# Security headers (handled by hosting platform)
# NEXT_PUBLIC_* vars are exposed to browser — only public config!
```

### Secrets Management

**Never commit production secrets.** Use platform secrets:

| Platform | Method |
|----------|--------|
| Vercel | Project Settings → Environment Variables |
| Docker | `docker run -e` or Docker secrets |
| Kubernetes | `Secret` resources |
| VM | `/etc/fee-bump-studio-app/.env` (600 perms) |

## RPC Provider Setup

### Stellar RPC (Official)

1. Create account at [rpc.stellar.org](https://rpc.stellar.org/)
2. Create project → Get project ID
3. Set `STELLAR_RPC_URL=https://rpc.stellar.org/your-project-id`
4. Configure rate limits and alerts

### QuickNode

1. Sign up at [quicknode.com](https://www.quicknode.com/chains/stellar)
2. Create Stellar endpoint
3. Copy HTTPS URL
4. Set as `STELLAR_RPC_URL`

### Self-Hosted Soroban RPC

```bash
# Using Docker
docker run -d \
  -p 8000:8000 \
  stellar/soroban-rpc:latest \
  --network mainnet \
  --db-path /data/soroban.db

# Or build from source
# https://github.com/stellar/soroban-rpc
```

## Contract Deployment

### Deploy to Mainnet

```bash
# In fee-bump-studio-contracts repo
cd fee-bump-studio-contracts

# Build
make build

# Deploy (requires stellar CLI and funded admin account)
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/fee_bump_studio_contracts.wasm \
  --source-admin-admin \
  --network mainnet \
  --rpc-url https://rpc.stellar.org/your-project-id
```

### Record Contract ID

Save the output contract ID (starts with `C`) to `STELLAR_CONTRACT_ID`.

## Domain & DNS

### Custom Domain

| Platform | Setup |
|----------|-------|
| Vercel | Project Settings → Domains → Add |
| Cloudflare | DNS → CNAME to `your-project.pages.dev` |
| Self-hosted | A/AAAA records to server IP |

### Recommended Structure

| Environment | Domain |
|-------------|--------|
| Production | `app.feebumpstudio.example.com` |
| Staging | `staging.app.feebumpstudio.example.com` |
| Preview (PR) | `pr-123.app.feebumpstudio.example.com` |

## SSL/TLS Certificates

| Platform | Method |
|----------|--------|
| Vercel | Automatic (Let's Encrypt) |
| Cloudflare | Automatic (Universal SSL) |
| Self-hosted | Certbot: `certbot --nginx -d app.example.com` |
| Docker | Traefik/Caddy with Let's Encrypt |

## Monitoring Setup

### Health Endpoint

The app serves `/` — add a dedicated health check:

```typescript
// app/api/health/route.ts (Next.js 15 App Router)
export async function GET() {
  return Response.json({ 
    ok: true, 
    network: process.env.STELLAR_NETWORK,
    timestamp: new Date().toISOString()
  });
}
```

### Uptime Monitoring

- **UptimeRobot** — Free tier available
- **Pingdom** — Synthetic monitoring
- **Datadog/New Relic** — Full APM
- **Self-hosted** — Prometheus + Alertmanager

### Log Aggregation

| Platform | Integration |
|----------|-------------|
| Vercel | Built-in + Log drains (Datadog, Logtail, etc.) |
| Docker | Loki + Promtail |
| Kubernetes | Loki + Promtail (DaemonSet) |
| VM | Vector/Filebeat → Elasticsearch/Logstash |

## Backup & Recovery

### Configuration Backup

```bash
# Backup environment (encrypted)
gpg --encrypt --recipient ops@feebumpstudio.example.com .env.production
```

### Contract Recovery

- Contract code is immutable (baseline)
- Admin key can re-initialize if needed
- Store admin secret in secure vault (1Password, Vault, etc.)

## Rollback Procedure

```bash
# Vercel
vercel rollback [deployment-url]

# Docker
docker tag fee-bump-studio-app:previous fee-bump-studio-app:latest
docker-compose up -d

# Kubernetes
kubectl rollout undo deployment/fee-bump-studio-app
```

## Pre-Launch Checklist

- [ ] Mainnet RPC configured and tested
- [ ] Mainnet contract deployed and verified
- [ ] Environment variables set in platform (not code)
- [ ] Custom domain configured with SSL
- [ ] Health endpoint responding
- [ ] Monitoring/alerting configured
- [ ] Rate limits understood and alerted
- [ ] Rollback procedure documented
- [ ] Team access configured
- [ ] Security headers verified

## Related Documentation

- [Build](build.md)
- [Hosting Options](hosting.md)
- [Release Procedures](release.md)
- [Network Settings](../configuration/network-settings.md)