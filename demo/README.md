# Letterboxd OAuth Demo

This demo spins up a small Node server that serves a static page for testing the complete authorization-code + PKCE flow against the Letterboxd OAuth endpoints.

## Prerequisites

- Node.js ≥ 18
- A Letterboxd API key/secret with a redirect URI pointing at `http://localhost:4173`

## Usage

```bash
npm run demo
```

This command builds the SDK (so the server can require `dist/index.js`) and then launches the demo on <http://localhost:4173>.

### Flow

1. Enter your API key/secret, redirect URI, and desired scopes.
2. Click **Start OAuth Flow**. The page will generate PKCE values, persist them to `sessionStorage`, and redirect you to Letterboxd’s consent page.
3. After approving, you’ll land back on the demo page with a `code` query param. The page automatically exchanges the code via the SDK and shows the resulting payload.
4. Use **Refresh Access Token** to try the refresh grant with the returned `refresh_token`.
5. Use **Clear Session** to wipe all in-memory data.

> API secrets only ever live in your browser tab’s `sessionStorage` and are never persisted to disk. Close the tab and they disappear.
