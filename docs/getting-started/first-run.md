# First Run

## Start the Development Server

```bash
npm run dev
```

Output:

```text
> fee-bump-studio-app@0.1.0 dev
> next dev

   ▲ Next.js 15.x.x
   - Local:        http://localhost:3000
   - Network:      http://<your-ip>:3000

 ✓ Starting...
 ✓ Ready in xxxms
```

## Open the Application

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Expected Baseline Screen

The development baseline displays:

- **FeeBumpStudio** title
- **Transaction fee-bump preparation toolkit** tagline
- **Network: Testnet development configuration** status
- Clean, minimal UI with system font

![Baseline Screen](assets/baseline-screen.png)

## Verify Network Connection

1. Check the network indicator in the UI header — should show "Testnet"
2. Open browser DevTools → Console
3. Look for Stellar SDK initialization logs

## Test Contract Connection (if configured)

If `STELLAR_CONTRACT_ID` is set:

1. The app attempts to connect to the Soroban contract
2. Check console for contract connection status
3. UI will show contract-ready state when successful

## Common First-Run Issues

| Issue | Solution |
|-------|----------|
| Port 3000 in use | Set `PORT=3001` in `.env.local` or kill the process on 3000 |
| RPC connection failed | Verify `STELLAR_RPC_URL` is accessible; try the public Testnet default |
| Contract not found | Ensure `STELLAR_CONTRACT_ID` matches a deployed contract on the target network |
| TypeScript errors | Run `npm run typecheck` to see detailed errors |

## Next Steps

- Explore the [User Guide](../user-guide/overview.md) to understand the workflow
- Read [Architecture](../developer-guide/architecture.md) for codebase overview
- Check [Local Development](../developer-guide/local-development.md) for development workflow