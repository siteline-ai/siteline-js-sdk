# Siteline JavaScript SDK

> Track AI agents, bots, and crawlers across your web applications with enterprise-grade analytics.

[![npm version](https://img.shields.io/npm/v/@siteline/core.svg)](https://www.npmjs.com/package/@siteline/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

## Overview

Siteline provides production-ready SDKs for tracking and analyzing AI agent interactions with your web applications. Monitor how AI systems from OpenAI, Google, Anthropic, Perplexity, and others access your content.

## Packages

| Package | Description |
|---------|-------------|
| [@siteline/core](./packages/core) | Universal SDK for JavaScript environments |
| [@siteline/nextjs](./packages/nextjs) | Next.js middleware integration |

See individual package documentation for detailed installation, usage, and API reference.

## Quick Start

Get your website key from [siteline.ai](https://siteline.ai), then choose your integration:

**Next.js:**
```bash
npm install @siteline/nextjs
```
See [Next.js package documentation](./packages/nextjs) for setup instructions.

**Other frameworks:**
```bash
npm install @siteline/core
```
See [Core SDK documentation](./packages/core) for implementation details.

## Development

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm run test

# Development mode with watch
npm run dev
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Run `npm run changeset` for user-facing changes
5. Submit a pull request

We follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

## Resources

- **Documentation**: [docs.gptrends.io/agent-analytics](https://docs.gptrends.io/agent-analytics)
- **API Reference**: [api.siteline.ai/docs](https://api.siteline.ai/docs)
- **Issues**: [GitHub Issues](https://github.com/siteline-ai/siteline-sdk-js/issues)
- **Support**: support@siteline.ai
- **Security**: security@siteline.ai

## License

MIT License - see [LICENSE](./LICENSE) for details.

---

**© 2025 Siteline**
