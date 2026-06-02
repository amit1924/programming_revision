# Project Context

## Goal
Build highly visual, interactive, self-contained HTML learning resources for web development concepts (CSS, JavaScript, security, etc.).

## Design System
- **Theme**: Dark (#0f0f17 background, #cdd6f4 text — Catppuccin-inspired)
- **Every HTML file** must be self-contained (all CSS + JS inline, no external dependencies)
- **Interactive**: Every guide must have live demos (toggles, sliders, presets, animations)
- **Responsive**: Mobile-friendly layouts within each file (`@media` queries)
- **Multi-colored** items for visual distinction

## Structure
```
react-native/
  asyncstorage.html
  expo-router-*.html
  expo-vs-rncli.html
  flatlist-pull-to-refresh.html
  flex1-vs-no-flex.html
  flexbox-all-properties.html
  image-properties.html
  keyboardavoidingview.html
  lists-with-map.html
  navigation-lifecycle.html
  overflow-properties.html
  render-*.html
  stack-navigation.html
  usecallback.html / useeffect-all-features.html / usememo.html / useref.html / usesearchparams.html
  virtual-dom.html
css-notes/
  flexbox/          — flexbox, flex:1, width, height, overflow
  grid/             — CSS Grid
  position/         — CSS position (static/relative/absolute/fixed/sticky + z-index + stacking context deep dive)
  navbar/           — navbar guide
  hero/             — hero section guide
  typography/       — text wrapping/breaking
  webkit/           — WebKit-specific CSS properties
  css-units/        — CSS units guide
javascript/
  arrays.html       — Array methods
  closure.html      — Closures deep visual guide (scope chain, factory, loops, IIFE, memoize)
  cors.html         — CORS deep visual guide
  equality.html     — Equality comparisons
  event-loop.html   — JS Event Loop
  events.html       — JS Events deep visual guide (propagation, delegation, custom events)
  middleware.html   — Express middleware
  node-event-loop.html — Node.js Event Loop phases
  objects.html      — Objects deep dive
  promises.html     — Promises & async/await
  prototype.html    — Prototype chain & inheritance
  scope.html        — Scope & hoisting
  strings.html      — String methods
  string-array-conversion.html — String ↔ Array
  user-agent.html   — User-Agent deep visual guide
  jsonwebtoken/     — JWT generation, verification, middleware, cookies vs Bearer
  security/         — Web security visual guides
    index.html      — overview landing page
    xss.html        — XSS (stored/reflected/DOM) with interactive injection demos
    csrf.html       — CSRF attack flow with animated scene
    cookie-flags.html — HttpOnly, SameSite, Secure interactive toggles
    session-hijacking.html — MITM, clickjacking, open redirect, CSP, HSTS
mcp/
  mcp.html          — MCP (Model Context Protocol) deep visual guide
  mcp-architecture.html — MCP 3-layer architecture (Host/Client/Server)
  mcp-how-it-works.html — MCP end-to-end weather example
  mcp-client-comparison.html — Raw vs LangChain MCP Client
  mcp-streamable-http.html — Streamable HTTP transport
  mcp-inspector.html — MCP Inspector debugging UI
  mcp-community-servers.html — Community MCP servers ecosystem (16,000+ servers, registries, ranking, security)
  mcp-best-for-daily-life.html — Best MCP picks for daily life (devs + students, interactive quiz, token costs, day-in-life)
python/
  name-main.html    — Python `if __name__ == "__main__"` deep visual guide
```

## Key Decisions & Conventions
- Every guide is **one self-contained HTML file** (CSS + JS inline)
- Use `<style>` + `<script>` within a single `.html` — no frameworks
- Use `clamp()` for responsive typography where appropriate
- SVG data URIs for background patterns (avoid external images)
- Dark theme consistency: `--bg:#0f0f17 --surface:#1a1a2e --text:#cdd6f4`
- Interactive elements with vanilla JS: `onclick`, `addEventListener`, `setTimeout`
- File naming: lowercase-kebab-case for directories, `.html` extension

## Critical Technical Notes (from past work)
- `flex: 1` = `flex-grow:1; flex-shrink:1; flex-basis:0`
- Height is NOT inherited; width is NOT inherited (block auto-fills parent but that's not inheritance)
- Inline elements ignore width and height
- Overflow only works when container has a constrained dimension
- `-webkit-line-clamp` still requires the `-webkit-` prefix in ALL browsers (2024+)
- iOS only allows WebKit engines (Chrome/Firefox on iOS are Safari under the hood)
- Same-Origin Policy blocks JS from reading cross-origin responses (not from sending them)
- CORS is server-driven — the server opts in via headers
- HttpOnly + Secure + SameSite = the holy trinity of cookie security
- Every modern UA starts with "Mozilla/5.0" for historical reasons — never trust UA for security
- JWT is signed, not encrypted. `jwt.verify()` is mandatory; `jwt.decode()` skips signature check

## Style Preferences
- No code comments in output unless asked
- Minimize explanatory text — be concise
- Prefer editing existing files over creating new ones (unless adding new topics)
- Use task tool for multi-step research; write directly for single-file creations
