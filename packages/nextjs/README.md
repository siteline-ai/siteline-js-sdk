# @siteline/nextjs

Official Next.js integration for Client - automatic AI agent and bot tracking with zero configuration.

## Features

- **AI Agent Detection**: Track bots from OpenAI, Google, Anthropic, Perplexity, and more
- **Zero Config**: Drop-in middleware for automatic tracking
- **Lightweight**: ~1.2KB minified + gzipped
- **Edge & Node.js**: Works in both Edge Runtime and Node.js
- **Type-safe**: Full TypeScript support
- **App Router & Pages Router**: Compatible with both Next.js routing systems
- **Automatic IP Detection**: Extracts real client IP from headers (Cloudflare, Vercel, etc.)
- **Performance**: Non-blocking, asynchronous tracking

## Installation

```bash
npm install @siteline/nextjs
```

```bash
yarn add @siteline/nextjs
```

```bash
pnpm add @siteline/nextjs
```

## Quick Start

### 1. Initialize Client (Edge Proxy)

Create or update your `proxy.ts` file:

```typescript
// proxy.ts
import { Client, withSiteline } from '@siteline/nextjs';

// Initialize Client (only needed once, in Edge Runtime)
Client.init({
  websiteKey: process.env.SITELINE_WEBSITE_KEY!,
  debug: process.env.NODE_ENV === 'development',
});

// Wrap your middleware with Client tracking
export default withSiteline();

// Optional: Configure middleware matcher
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### 2. Track Node.js Requests (Optional)

For API routes or server-side rendering in Node.js runtime:

```typescript
// app/api/users/route.ts
import { Client } from '@siteline/nextjs';
import { trackNodeRequest } from '@siteline/nextjs/node';
import { NextRequest, NextResponse } from 'next/server';

// Initialize in Node.js runtime
Client.init({
  websiteKey: process.env.SITELINE_WEBSITE_KEY!,
});

export async function GET(req: NextRequest) {
  // Track Node.js request
  trackNodeRequest(req, NextResponse.next());

  // Your API logic
  return NextResponse.json({ users: [] });
}
```

## API Reference

### `Client.init(config: SitelineConfig)`

Initialize the Client tracker. Must be called before tracking.

```typescript
import { Client } from '@siteline/nextjs';

Client.init({
  websiteKey: 'siteline_secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Required
  endpoint: 'https://api.siteline.ai/v1/intake/pageview',     // Optional
  debug: false,                                                // Optional
});
```

**Configuration Options:**

```typescript
type SitelineConfig = {
  websiteKey: string;    // Your Client website key (format: siteline_secret_<32 hex chars>)
  endpoint?: string;     // Custom API endpoint (default: https://api.siteline.ai/v1/intake/pageview)
  debug?: boolean;       // Enable debug logging (default: false)
};
```

### `withSiteline(middleware?: Proxy)`

Wraps your Next.js middleware to automatically track requests in Edge Runtime.

```typescript
import { withSiteline } from '@siteline/nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Without custom middleware
export default withSiteline();

// With custom middleware
export default withSiteline((request: NextRequest) => {
  // Your custom middleware logic
  const response = NextResponse.next();
  response.headers.set('x-custom-header', 'value');
  return response;
});
```

### `trackNodeRequest(req: IncomingMessage, res: ServerResponse)`

Track a Node.js HTTP request (for API routes, SSR, etc.).

```typescript
import { trackNodeRequest } from '@siteline/nextjs/node';
import type { IncomingMessage, ServerResponse } from 'http';

export function handler(req: IncomingMessage, res: ServerResponse) {
  trackNodeRequest(req, res);
  // Your handler logic
}
```

### `Client.track(data: PageviewData)`

Manually track a custom event.

```typescript
import { Client } from '@siteline/nextjs';

Client.track({
  url: '/api/custom',
  method: 'POST',
  status: 200,
  duration: 45,
  userAgent: 'Custom Client/1.0',
  ref: null,
  ip: '192.168.1.1',
});
```

### `Client.isReady()`

Check if Client has been initialized.

```typescript
if (Client.isReady()) {
  Client.track({...});
}
```

## Usage Examples

### App Router with Custom Proxy

```typescript
// proxy.ts
import { Client, withSiteline } from '@siteline/nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

Client.init({
  websiteKey: process.env.SITELINE_WEBSITE_KEY!,
  debug: process.env.NODE_ENV === 'development',
});

function customMiddleware(request: NextRequest) {
  // Add custom headers
  const response = NextResponse.next();

  // Custom logic
  if (request.nextUrl.pathname.startsWith('/admin')) {
    response.headers.set('x-admin-access', 'true');
  }

  return response;
}

export default withSiteline(customMiddleware);

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### API Route with Node.js Tracking

```typescript
// app/api/products/route.ts
import { Client } from '@siteline/nextjs';
import { NextRequest, NextResponse } from 'next/server';

Client.init({
  websiteKey: process.env.SITELINE_WEBSITE_KEY!,
});

export async function GET(req: NextRequest) {
  const start = Date.now();

  try {
    // Your API logic
    const products = await fetchProducts();

    // Manual tracking
    Client.track({
      url: req.nextUrl.pathname,
      method: 'GET',
      status: 200,
      duration: Date.now() - start,
      userAgent: req.headers.get('user-agent'),
      ref: req.headers.get('referer'),
      ip: req.headers.get('x-forwarded-for')?.split(',')[0] || null,
    });

    return NextResponse.json(products);
  } catch (error) {
    Client.track({
      url: req.nextUrl.pathname,
      method: 'GET',
      status: 500,
      duration: Date.now() - start,
      userAgent: req.headers.get('user-agent'),
      ref: req.headers.get('referer'),
      ip: null,
    });

    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

### Pages Router (Legacy)

```typescript
// pages/_middleware.ts (Next.js 12)
// or proxy.ts (Next.js 13+ with Pages Router)

import { Client, withSiteline } from '@siteline/nextjs';

Client.init({
  websiteKey: process.env.SITELINE_WEBSITE_KEY!,
});

export default withSiteline();
```

## Automatic IP Detection

The SDK automatically extracts the real client IP from common headers:

1. `x-forwarded-for` (first IP in comma-separated list)
2. `x-real-ip`
3. `cf-connecting-ip` (Cloudflare)

Works out of the box with:
- Vercel Edge Network
- Cloudflare Workers
- AWS CloudFront
- Nginx/Apache reverse proxies

## Runtime Detection

The SDK automatically detects the runtime environment:

- **Edge Runtime**: Uses `withSiteline()` middleware
- **Node.js Runtime**: Uses `trackNodeRequest()` for API routes

Detection logic:

```typescript
const isEdge = process.env.NEXT_RUNTIME === 'edge';
```

## Environment Variables

```bash
# .env.local
SITELINE_WEBSITE_KEY=siteline_secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional: Custom endpoint
SITELINE_ENDPOINT=https://custom-endpoint.example.com/track

# Optional: Enable debug mode in development
NODE_ENV=development
```

## TypeScript Support

All types are exported for use in your application:

```typescript
import {
  Client,
  withSiteline,
  type SitelineConfig,
  type PageviewData,
} from '@siteline/nextjs';

const config: SitelineConfig = {
  websiteKey: 'siteline_secret_abc123...',
  debug: true,
};

Client.init(config);
```

## Performance Considerations

- **Non-blocking**: All tracking is asynchronous and won't block request handling
- **5-second timeout**: Network requests automatically abort after 5 seconds
- **Edge-optimized**: Minimal bundle size for Edge Runtime
- **No external dependencies**: Only depends on `@siteline/core`

## Compatibility

- **Next.js**: >=13.0.0 (App Router and Pages Router)
- **Node.js**: >=18.0.0
- **Runtimes**: Edge Runtime, Node.js
- **TypeScript**: Full type safety

## Troubleshooting

### Tracking not working

1. Ensure `Client.init()` is called before tracking
2. Check your website key format: `siteline_secret_<32 hex chars>`
3. Enable debug mode to see console logs:

```typescript
Client.init({
  websiteKey: process.env.SITELINE_WEBSITE_KEY!,
  debug: true, // Enable debug logs
});
```

### Edge vs Node.js runtime issues

Edge Runtime only:
- `withSiteline()` middleware

Node.js only:
- `trackNodeRequest()` for API routes
- Access to `IncomingMessage` and `ServerResponse`

### Proxy not executing

Check your `proxy.ts` matcher configuration:

```typescript
export const config = {
  matcher: [
    // Match all paths except static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

## Examples

See the [examples](https://github.com/siteline-ai/siteline-sdk-js/tree/main/examples) directory for complete working examples:

- Next.js App Router
- Next.js Pages Router
- API Routes
- Custom middleware

## License

MIT

## Support

- **GitHub Issues**: [github.com/siteline-ai/siteline-sdk-js/issues](https://github.com/siteline-ai/siteline-sdk-js/issues)
- **Documentation**: [docs.gptrends.io/agent-analytics](https://docs.gptrends.io/agent-analytics)
- **Repository**: [github.com/siteline-ai/siteline-sdk-js](https://github.com/siteline-ai/siteline-sdk-js)

## Related Packages

- [@siteline/core](https://www.npmjs.com/package/@siteline/core) - Core tracking SDK
