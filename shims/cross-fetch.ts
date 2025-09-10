// Minimal shim to provide named `fetch`, `Headers`, `Request`, `Response`
// from the global environment (browser or Node >= 18).
// Appwrite ESM expects `import { fetch } from 'cross-fetch'` in browser.
const g: any = globalThis as any

export const fetch: typeof globalThis.fetch = g.fetch.bind(g)
export const Headers: typeof globalThis.Headers = g.Headers
export const Request: typeof globalThis.Request = g.Request
export const Response: typeof globalThis.Response = g.Response

export default fetch
