# Contributing Guide

## Development Workflow

### Setup
```bash
npm install          # Install dependencies
npm run build        # Build all packages
npm test             # Run tests
npm run lint         # Check code quality
```

### Working on Packages
```bash
# Development mode (watch & rebuild)
npm run dev

# Build specific package
cd packages/core && npm run build
cd packages/nextjs && npm run build

# Test specific package
cd packages/core && npm test
cd packages/nextjs && npm run test:watch
```

### Code Quality
```bash
npm run lint         # ESLint check
npm run typecheck    # TypeScript check
npm test:coverage    # Test with coverage reports
```

## Release Workflow

### 1. Create a Changeset
After making changes, create a changeset to document them:

```bash
npm run changeset
```

This will prompt you to:
- Select affected packages (`@siteline/core`, `@siteline/nextjs`)
- Choose version bump type:
  - **patch** (1.0.x) - Bug fixes, internal changes
  - **minor** (1.x.0) - New features, backward compatible
  - **major** (x.0.0) - Breaking changes
- Write a summary for the changelog

Commit the generated `.changeset/*.md` file with your changes.

### 2. Open Pull Request
- Push your branch and create a PR to `main`
- CI runs automatically:
  - Lint & type checking
  - Build verification
  - Security scan
  - Node 18/20/22 compatibility tests
  - Changeset validation

### 3. Merge to Main
When merged, CI checks for changesets:
- If found, creates a "Version Packages" PR
- This PR updates versions and changelogs

### 4. Publish Release
Merge the "Version Packages" PR to trigger:
- Package builds
- npm publish with provenance
- GitHub Release creation
- SBOM generation

## Requirements

### Node & npm Versions
- Node: >= 18.0.0
- npm: >= 9.0.0

## Testing

```bash
# Run all tests
npm test

# Watch mode (per package)
cd packages/core && npm run test:watch

# Coverage reports
npm run test:coverage
```

Test files live in `packages/*/src/__tests__/` and mirror the source structure.

## Monorepo Structure

```
siteline-sdk-js/
├── packages/
│   ├── core/           # @siteline/core (universal SDK)
│   └── nextjs/         # @siteline/nextjs (Next.js middleware)
├── examples/
│   └── nextjs/         # Example integration
└── .github/workflows/  # CI/CD automation
```

## Common Commands Reference

| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies |
| `npm run build` | Build all packages |
| `npm run dev` | Watch mode for development |
| `npm test` | Run all tests |
| `npm run lint` | Lint code |
| `npm run changeset` | Create changeset for release |
| `npm run version` | Preview version bumps (local) |
| `npm run release` | Manual publish (use CI instead) |