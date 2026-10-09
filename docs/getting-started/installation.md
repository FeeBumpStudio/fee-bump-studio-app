# Installation

## Clone the Repository

```bash
git clone https://github.com/FeeBumpStudio/fee-bump-studio-app.git
cd fee-bump-studio-app
```

## Install Dependencies

```bash
npm install
```

This installs all production and development dependencies listed in `package.json`:

```json
{
  "dependencies": {
    "@stellar/stellar-sdk": "17.2.1",
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "typescript": "^5.9.3"
  }
}
```

## Verify Installation

Run the type-check to verify the TypeScript configuration:

```bash
npm run typecheck
```

Expected output (no errors):

```
> fee-bump-studio-app@0.1.0 typecheck
> tsc -p tsconfig.ci.json
```

## Next Steps

- [Configuration](configuration.md) — Set up environment variables
- [First Run](first-run.md) — Start the development server
- [Project Structure](../developer-guide/project-structure.md) — Understand the codebase layout