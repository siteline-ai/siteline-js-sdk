# Client SDK for JavaScript

Official JavaScript/TypeScript SDK for [Client](https://siteline.io) - Agent Analytics platform for tracking how AI agents, bots, and crawlers interact with your website.

## Packages

This monorepo contains the following packages:

| Package | Version | Description | Size |
|---------|---------|-------------|------|
| [@siteline/core](./packages/core) | 1.0.0 | Core agent tracking SDK for any JavaScript environment | ~1.6KB |
| [@siteline/nextjs](./packages/nextjs) | 1.0.0 | Next.js middleware for automatic AI agent tracking | ~1.2KB |

## Features

- **AI Agent Detection**: Track bots from OpenAI, Google, Anthropic, Perplexity, and more
- **Page-Level Analytics**: Understand which content AI agents are crawling
- **Lightweight**: Minimal bundle sizes for fast page loads (~1.6KB)
- **Type-safe**: Full TypeScript support with exported types
- **Zero dependencies**: No external runtime dependencies
- **Edge-ready**: Works in Edge Runtimes, Node.js, and browsers
- **Framework integrations**: Official Next.js support with more coming soon

## Quick Start

### Next.js (Recommended)

```bash
npm install @siteline/nextjs
```

```typescript
// proxy.ts
import { Client, withSiteline } from '@siteline/nextjs';

Client.init({
  websiteKey: process.env.SITELINE_WEBSITE_KEY!,
});

export default withSiteline();
```

[View Next.js documentation →](./packages/nextjs/README.md)

### Core SDK (Universal)

```bash
npm install @siteline/core
```

```typescript
import { Client } from '@siteline/core';

const tracker = new Client({
  websiteKey: 'siteline_secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
});

tracker.track({
  url: '/home',
  method: 'GET',
  status: 200,
  duration: 45,
  userAgent: 'Mozilla/5.0...',
  ref: 'https://google.com',
  ip: '192.168.1.1',
  sdk: '@siteline/core',
  sdk_version: '1.0.0',
  integration_type: 'custom',
  websiteKey: 'siteline_secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
});
```

[View Core SDK documentation →](./packages/core/README.md)

## Installation

### Using npm

```bash
npm install @siteline/nextjs  # For Next.js
npm install @siteline/core    # For other frameworks
```

### Using yarn

```bash
yarn add @siteline/nextjs  # For Next.js
yarn add @siteline/core    # For other frameworks
```

### Using pnpm

```bash
pnpm add @siteline/nextjs  # For Next.js
pnpm add @siteline/core    # For other frameworks
```

## Requirements

- **Node.js**: >=18.0.0
- **Next.js** (for @siteline/nextjs): >=13.0.0
- **TypeScript** (optional): >=5.0.0

## Examples

Explore complete working examples:

- [Next.js App Router](./examples/nextjs-app) - Modern Next.js with App Router
- [Node.js](./examples/nodejs) - Standalone Node.js application

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/siteline-ai/siteline-sdk-js.git
cd siteline-sdk-js

# Install dependencies
npm install

# Build all packages
npm run build

# Run in development mode
npm run dev
```

### Available Scripts

```bash
npm run build       # Build all packages
npm run dev         # Development mode with watch
npm run clean       # Clean build artifacts
npm run lint        # Lint all packages
npm run lint:fix    # Fix linting issues
npm run typecheck   # Type check without emitting
npm run changeset   # Create a new changeset
npm run version     # Version packages based on changesets
npm run release     # Build and publish to npm
```

### Monorepo Structure

```
siteline-sdk-js/
├── packages/
│   ├── core/           # @siteline/core
│   │   ├── src/
│   │   ├── dist/
│   │   ├── package.json
│   │   └── README.md
│   └── nextjs/         # @siteline/nextjs
│       ├── src/
│       ├── dist/
│       ├── package.json
│       └── README.md
├── examples/
│   ├── nextjs-app/     # Next.js App Router example
│   └── nodejs/         # Node.js example
├── .changeset/         # Changesets for versioning
├── .github/
│   └── workflows/      # CI/CD workflows
└── package.json        # Root package.json
```

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Add a changeset: `npm run changeset`
5. Commit your changes: `git commit -am 'feat: add new feature'`
6. Push to the branch: `git push origin feature/my-feature`
7. Submit a pull request

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `chore:` - Maintenance tasks
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `ci:` - CI/CD changes

### Creating Changesets

Before submitting a PR with user-facing changes:

```bash
npm run changeset
```

Follow the prompts to:
1. Select packages to version
2. Choose version bump type (major, minor, patch)
3. Write a description of the change

## Release Process

Releases are automated via GitHub Actions:

1. Create a changeset for your changes: `npm run changeset`
2. Commit and push the changeset
3. Merge to `main` branch
4. CI will create a "Version Packages" PR
5. Merge the PR to publish to npm
6. GitHub releases are created automatically

**Note**: Releases will only occur if changesets exist. This prevents accidental releases with unchanged versions.

## Versioning

We use [Changesets](https://github.com/changesets/changesets) for version management:

- **Automated versioning**: Changesets handle version bumps
- **Coordinated releases**: Multiple packages can be released together
- **Changelog generation**: Automatic CHANGELOG.md updates with GitHub integration
- **No unchanged releases**: CI validates that versions have changed before publishing

## CI/CD

### Continuous Integration

Every PR and push to `main` runs:

- ✅ Linting (ESLint)
- ✅ Type checking (TypeScript)
- ✅ Building (Rollup)
- ✅ Package integrity checks
- ✅ Multi-version Node.js testing (18, 20, 22)

### Continuous Deployment

Merging to `main` with changesets:

- 📦 Creates a "Version Packages" PR
- 🚀 Publishing to npm when PR is merged
- 📝 Automatic CHANGELOG.md updates
- 🏷️ GitHub release creation with release notes

## Browser & Runtime Support

### Browsers
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Modern browsers with Fetch API support

### Runtimes
- Node.js 18+
- Deno (with npm specifiers)
- Bun
- Cloudflare Workers
- Vercel Edge Runtime
- AWS Lambda@Edge

## Security

- **HTTPS Only**: All data transmission encrypted
- **Input Sanitization**: All inputs validated and sanitized
- **No Eval**: No use of `eval()` or similar unsafe functions
- **Timeout Protection**: 5-second request timeouts
- **Minimal Dependencies**: Zero runtime dependencies reduces attack surface

Report security vulnerabilities to: security@siteline.io

## License

MIT License - see [LICENSE](./LICENSE) for details

## Support

- **Documentation**: [docs.siteline.io](https://docs.siteline.io)
- **GitHub Issues**: [github.com/siteline/siteline-sdk-js/issues](https://github.com/siteline-ai/siteline-sdk-js/issues)
- **Email**: support@siteline.io
- **Twitter**: [@siteline_io](https://twitter.com/siteline_io)

## Roadmap

- [ ] React hooks package (`@siteline/react`)
- [ ] Vue.js plugin (`@siteline/vue`)
- [ ] Express.js middleware (`@siteline/express`)
- [ ] Svelte integration (`@siteline/svelte`)
- [ ] Browser client (`@siteline/browser`)
- [ ] Advanced filtering and sampling
- [ ] Custom event tracking
- [ ] Session recording

## Links

- [Website](https://siteline.io)
- [Documentation](https://docs.siteline.io)
- [API Reference](https://api.siteline.io/docs)
- [Changelog](./CHANGELOG.md)
- [NPM - @siteline/core](https://www.npmjs.com/package/@siteline/core)
- [NPM - @siteline/nextjs](https://www.npmjs.com/package/@siteline/nextjs)
