# Netlify Edge Function Example

Track every incoming request in Netlify Edge Runtime using `@siteline/core`.

## 1. Add the edge function

Copy `edge-functions/siteline.ts` into your Netlify project.

Set these constants at the top of that file:

- `SITELINE_WEBSITE_KEY`
- `SITELINE_ENDPOINT` (optional)
- `SITELINE_DEBUG` (optional)

## 2. Configure Netlify routes

Create `netlify.toml`:

```toml
[build]
  edge_functions = "edge-functions"

[[edge_functions]]
  path = "/*"
  function = "siteline"
```

This makes Siteline run for every incoming request.

## Behavior

- Proxies the request with `context.next()`
- Tracks `url`, `method`, `status`, `duration`, `userAgent`, `ref`, `ip`, and `acceptHeader`
- Keeps tracking non-blocking (fire-and-forget)
- Tracks failed downstream requests with status `500`
