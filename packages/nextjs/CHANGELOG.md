# @siteline/nextjs

## 1.0.1

### Patch Changes

- [#3](https://github.com/siteline-ai/siteline-sdk-js/pull/3) [`8a11963`](https://github.com/siteline-ai/siteline-sdk-js/commit/8a119638b9fb31133677092d80066ff68b545847) Thanks [@antoineaudrain](https://github.com/antoineaudrain)! - clean up README and fix examples

- Updated dependencies [[`8a11963`](https://github.com/siteline-ai/siteline-sdk-js/commit/8a119638b9fb31133677092d80066ff68b545847)]:
  - @siteline/core@1.0.1

## 1.0.0

Initial release

### Features

- Next.js middleware integration for automatic request tracking
- Edge Runtime support
- Node.js runtime support with `trackNodeRequest()`
- App Router and Pages Router compatibility
- Automatic IP detection from headers (x-forwarded-for, x-real-ip, cf-connecting-ip)
- TypeScript support with full type definitions
- Singleton pattern for easy initialization
- Zero configuration tracking with `withSiteline()`
- ~1.2KB minified + gzipped
- Next.js 13+ support
