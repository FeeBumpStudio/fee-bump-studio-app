# Release Procedures

## Versioning

We use [Semantic Versioning](https://semver.org/):

- **Major** — Breaking changes, API incompatibility
- **Minor** — New features, backward compatible
- **Patch** — Bug fixes, backward compatible

Current: `v0.1.0` (development baseline)

## Release Process

### 1. Prepare Release

```bash
# On main branch
git checkout main
git pull origin main

# Run full validation
npm run typecheck
npm run build
npm test  # When available
```

### 2. Update Version

```bash
# Patch release (bug fixes)
npm version patch

# Minor release (new features)
npm version minor

# Major release (breaking changes)
npm version major
```

This:
- Updates `package.json` version
- Creates git tag `vX.Y.Z`
- Commits the change

### 3. Generate Changelog

```bash
# Manual or use conventional-changelog
npx conventional-changelog -p angular -i CHANGELOG.md -s -r 0
```

### 4. Push Release

```bash
git push origin main --tags
```

### 5. GitHub Release

1. Go to [Releases](https://github.com/FeeBumpStudio/fee-bump-studio-app/releases)
2. Click "Draft a new release"
3. Select tag `vX.Y.Z`
4. Title: `Release vX.Y.Z`
5. Description: Copy from CHANGELOG
6. Publish

### 6. Deployment

Automatic via GitHub Actions on tag push:

```yaml
# .github/workflows/release.yml (future)
on:
  push:
    tags: ['v*']
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## Release Checklist

- [ ] All CI checks pass on `main`
- [ ] Version bumped appropriately
- [ ] CHANGELOG updated
- [ ] Git tag created and pushed
- [ ] GitHub Release published
- [ ] Deployment successful
- [ ] Health checks passing
- [ ] Team notified

## Hotfix Process

For urgent production fixes:

```bash
# 1. Create hotfix branch from main
git checkout -b hotfix/urgent-fix main

# 2. Make minimal fix
# ... edit files ...

# 3. Test
npm run typecheck && npm run build

# 4. Version bump (patch)
npm version patch

# 5. Push and release
git push origin hotfix/urgent-fix --tags
# Open PR to main, merge after review
```

## Rollback

If release has issues:

```bash
# 1. Revert deployment (platform-specific)
# Vercel: vercel rollback
# Docker: redeploy previous tag
# Kubernetes: kubectl rollout undo

# 2. Revert git tag (if needed)
git tag -d vX.Y.Z
git push origin :refs/tags/vX.Y.Z

# 3. Create patch release with fix
git checkout main
git cherry-pick <fix-commit>
npm version patch
git push origin main --tags
```

## Release Communication

| Channel | Audience | Timing |
|---------|----------|--------|
| GitHub Release | Developers, users | Immediate |
| Discord/Slack | Community | Within 1 hour |
| Twitter/X | Public | Within 4 hours |
| Email (if list) | Stakeholders | Within 24 hours |

## Support Policy

| Version | Support |
|---------|---------|
| **Latest minor** | Full support, bug fixes |
| **Previous minor** | Security fixes only |
| **Older** | Upgrade recommended |

> Current baseline `v0.x` — No stability guarantees. Breaking changes expected.

## Related Documentation

- [Deployment - Build](build.md)
- [Deployment - Environment Setup](environment-setup.md)
- [Contributing](../developer-guide/contributing.md)