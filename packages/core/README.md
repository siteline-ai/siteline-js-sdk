# @siteline/core

Core tracking SDK for Client - Agent Analytics platform for tracking how AI agents, bots, and crawlers interact with your website.

## Features

- **AI Agent Tracking**: Track bots from OpenAI, Google, Anthropic, Perplexity, and more
- **Lightweight**: ~1.6KB minified + gzipped
- **Type-safe**: Full TypeScript support with exported types
- **Zero dependencies**: No external runtime dependencies
- **Automatic sanitization**: Request data validation and size limits
- **HTTPS enforced**: Secure-only data transmission
- **Configurable**: Custom endpoints and debug mode
- **Edge-ready**: Works in edge runtimes, Node.js, and browsers

## Installation

```bash
npm install @siteline/core
```

```bash
yarn add @siteline/core
```

```bash
pnpm add @siteline/core
```

## Quick Start

```typescript
import { Client } from '@siteline/core';

// Initialize the tracker
const siteline = new Client({
  websiteKey: 'siteline_secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  debug: true, // Optional: enable debug logs
});

// Track a pageview
siteline.track({
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

## API Reference

### `new Client(config: SitelineConfig)`

Creates a new Client tracker instance.

#### Configuration Options

```typescript
type SitelineConfig = {
  websiteKey: string;    // Required: Your Client website key (format: siteline_secret_<32 hex chars>)
  endpoint?: string;     // Optional: Custom API endpoint (default: https://api.siteline.ai/v1/intake/pageview)
  debug?: boolean;       // Optional: Enable debug logging (default: false)
};
```

**Example:**

```typescript
const siteline = new Client({
  websiteKey: 'siteline_secret_abc123...',
  endpoint: 'https://custom-endpoint.example.com/track', // Optional
  debug: process.env.NODE_ENV === 'development',         // Optional
});
```

### `siteline.track(data: PageviewData)`

Tracks a pageview event. Data is automatically sanitized and sent asynchronously.

#### PageviewData Type

```typescript
type PageviewData = {
  websiteKey: string;       // Your Client website key
  sdk: string;              // SDK identifier (e.g., '@siteline/core')
  sdk_version: string;      // SDK version (e.g., '1.0.0')
  integration_type: string; // Integration type (e.g., 'nextjs', 'express', 'custom')

  // Request data
  url: string;              // Request URL path (max 2048 chars)
  method: string;           // HTTP method (max 10 chars, uppercased)
  userAgent: string | null; // User-Agent header (max 512 chars)
  ref: string | null;       // Referer header (max 2048 chars)
  ip: string | null;        // Client IP address (max 45 chars for IPv6)

  // Response data
  status: number;           // HTTP status code (0-999)
  duration: number;         // Request duration in ms (0-300000)
};
```

**Example:**

```typescript
siteline.track({
  websiteKey: 'siteline_secret_abc123...',
  sdk: '@siteline/core',
  sdk_version: '1.0.0',
  integration_type: 'custom',
  url: '/api/users',
  method: 'GET',
  status: 200,
  duration: 125,
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...',
  ref: 'https://example.com/home',
  ip: '203.0.113.42',
});
```

## Data Sanitization

All tracked data is automatically sanitized to ensure security and data integrity:

- **URL**: Truncated to 2048 characters
- **Method**: Uppercased, truncated to 10 characters
- **Status**: Clamped to 0-999 range
- **Duration**: Clamped to 0-300000ms (5 minutes)
- **User-Agent**: Truncated to 512 characters
- **Referrer**: Truncated to 2048 characters
- **IP Address**: Truncated to 45 characters (IPv6 compatible)
- **SDK/Integration**: Truncated to safe limits

## Error Handling

The SDK handles errors gracefully:

- **Invalid website key format**: Throws error during initialization
- **Non-HTTPS endpoint**: Throws error during initialization
- **Network errors**: Silently caught, logged in debug mode
- **Timeout errors**: Request aborted after 5 seconds

```typescript
try {
  const tracker = new Client({
    websiteKey: 'invalid-key', // Throws error
  });
} catch (error) {
  console.error(error); // [Client] Invalid websiteKey format...
}
```

## Debug Mode

Enable debug logging to troubleshoot integration issues:

```typescript
const tracker = new Client({
  websiteKey: 'siteline_secret_abc123...',
  debug: true,
});

siteline.track({...});
// Console output:
// [Client] Client initialized { endpoint: 'https://api.siteline.ai/v1/intake/pageview' }
// [Client] Tracked: /home
```

## Environment Compatibility

- **Node.js**: >=18.0.0
- **Edge Runtimes**: Cloudflare Workers, Vercel Edge, Deno
- **Browsers**: Modern browsers with Fetch API support
- **TypeScript**: Full type safety with exported types

## Security

- **HTTPS Only**: All data transmission over encrypted connections
- **No PII Storage**: IP addresses and user agents are optional
- **Input Validation**: All inputs sanitized and validated
- **Timeout Protection**: 5-second request timeout
- **No Eval**: No use of `eval()` or similar unsafe functions

## Framework Integration

While `@siteline/core` can be used standalone, we provide official integrations:

- **[@siteline/nextjs](https://www.npmjs.com/package/@siteline/nextjs)**: Next.js middleware integration

## TypeScript Usage

All types are exported for use in your application:

```typescript
import { Client, type SitelineConfig, type PageviewData } from '@siteline/core';

const config: SitelineConfig = {
  websiteKey: 'siteline_secret_abc123...',
  debug: true,
};

const tracker = new Client(config);

const data: PageviewData = {
  websiteKey: config.websiteKey,
  sdk: '@siteline/core',
  sdk_version: '1.0.0',
  integration_type: 'custom',
  url: '/api/endpoint',
  method: 'POST',
  status: 201,
  duration: 89,
  userAgent: null,
  ref: null,
  ip: null,
};

siteline.track(data);
```

## License

MIT

## Support

- **GitHub Issues**: [github.com/siteline-ai/siteline-sdk-js/issues](https://github.com/siteline-ai/siteline-sdk-js/issues)
- **Documentation**: [docs.gptrends.io/agent-analytics](https://docs.gptrends.io/agent-analytics)
- **Repository**: [github.com/siteline-ai/siteline-sdk-js](https://github.com/siteline-ai/siteline-sdk-js)
