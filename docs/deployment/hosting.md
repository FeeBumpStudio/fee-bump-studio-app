# Hosting Options

## Overview

The FeeBumpStudio App is a Next.js application that can be deployed anywhere Node.js runs. The build output is a standard Node.js application.

## Recommended Platforms

| Platform | Type | Best For |
|----------|------|----------|
| **Vercel** | Managed Next.js | Zero-config, preview deployments |
| **Docker/Container** | Self-managed | Full control, existing infrastructure |
| **Static Export** | CDN-only | Read-only, no server functions |
| **Cloudflare Pages** | Edge | Global distribution, edge functions |

## Vercel (Recommended)

### Quick Deploy

1. Push to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Configuration

```json
// vercel.json (optional)
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "env": {
    "STELLAR_NETWORK": "@stellar-network",
    "STELLAR_RPC_URL": "@stellar-rpc-url",
    "STELLAR_CONTRACT_ID": "@stellar-contract-id"
  }
}
```

### Environment Variables in Vercel

Set in Project Settings → Environment Variables:

| Variable | Environment |
|----------|-------------|
| `STELLAR_NETWORK` | Production, Preview, Development |
| `STELLAR_RPC_URL` | Production, Preview, Development |
| `STELLAR_CONTRACT_ID` | Production, Preview, Development |

### Preview Deployments

Every PR gets a unique preview URL with its own environment.

## Docker Deployment

### Build Image

```bash
docker build -t fee-bump-studio-app .
```

### Run Container

```bash
docker run -d \
  -p 3000:3000 \
  -e STELLAR_NETWORK=mainnet \
  -e STELLAR_RPC_URL=https://rpc.stellar.org/your-project \
  -e STELLAR_CONTRACT_ID=CXYZ...MAINNET \
  fee-bump-studio-app
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - STELLAR_NETWORK=mainnet
      - STELLAR_RPC_URL=https://rpc.stellar.org/your-project
      - STELLAR_CONTRACT_ID=CXYZ...MAINNET
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Kubernetes (Example)

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: fee-bump-studio-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: fee-bump-studio-app
  template:
    metadata:
      labels:
        app: fee-bump-studio-app
    spec:
      containers:
      - name: app
        image: fee-bump-studio-app:latest
        ports:
        - containerPort: 3000
        env:
        - name: STELLAR_NETWORK
          valueFrom:
            secretKeyRef:
              name: feebumpstudio-secrets
              key: stellar-network
        - name: STELLAR_RPC_URL
          valueFrom:
            secretKeyRef:
              name: feebumpstudio-secrets
              key: stellar-rpc-url
        - name: STELLAR_CONTRACT_ID
          valueFrom:
            secretKeyRef:
              name: feebumpstudio-secrets
              key: stellar-contract-id
        readinessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: fee-bump-studio-app
spec:
  selector:
    app: fee-bump-studio-app
  ports:
  - port: 80
    targetPort: 3000
  type: ClusterIP
```

## Static Export (CDN Only)

### Configuration

```javascript
// next.config.js
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
};

module.exports = nextConfig;
```

### Limitations

- No server-side rendering
- No API routes
- No dynamic routes with `getServerSideProps`
- Wallet connection still works (client-side only)

### Deploy to CDN

```bash
npm run build
# Output in out/
aws s3 sync out/ s3://your-bucket --delete
# Or Cloudflare Pages, Netlify, etc.
```

## Self-Hosted (VM/VPS)

### Systemd Service

```ini
# /etc/systemd/system/fee-bump-studio-app.service
[Unit]
Description=FeeBumpStudio App
After=network.target

[Service]
Type=simple
User=appuser
WorkingDirectory=/opt/fee-bump-studio-app
Environment=NODE_ENV=production
EnvironmentFile=/opt/fee-bump-studio-app/.env.production
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### Nginx Reverse Proxy

```nginx
# /etc/nginx/sites-available/fee-bump-studio-app
server {
    listen 80;
    server_name app.feebumpstudio.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
}
```

## SSL/TLS

Always use HTTPS in production:

- **Vercel/Cloudflare** — Automatic
- **Self-hosted** — Let's Encrypt via Certbot
- **Docker** — Traefik/Caddy for automatic certificates

## Monitoring

| Platform | Metrics | Logs |
|----------|---------|------|
| Vercel | Built-in analytics | Real-time logs |
| Docker | cAdvisor + Prometheus | Loki/ELK |
| Kubernetes | Prometheus Operator | Loki/Grafana |
| VM | Node Exporter + Prometheus | Journalctl/ELK |

## Security Hardening

- **Headers** — CSP, HSTS, X-Frame-Options
- **Rate limiting** — Nginx/Cloudflare/Vercel
- **Secrets** — Never in image; use env/secrets manager
- **Updates** — Regular base image updates

## Related Documentation

- [Build](build.md)
- [Environment Setup](environment-setup.md)
- [Release Procedures](release.md)