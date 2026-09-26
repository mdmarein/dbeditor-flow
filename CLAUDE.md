# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start   # node server.js — runs on http://localhost:3100 (override with PORT env var), opens browser automatically
npm run dev # node --watch server.js — auto-restarts on file changes
```

There is no build step, no bundler, no test suite, and no linter configured — the frontend is plain ES modules loaded directly by the browser via `<script type="module">`, and `server.js` has zero npm dependencies (only Node's `http`, `fs`, `path`, `url`). Verify frontend changes by starting the server and exercising the UI in a browser; there's no automated test to run instead.

## Architecture

DBEditor Flow is a standalone CSV/XLSX editor extracted from the larger DataB Flow project. Everything runs client-side; the Node server only serves static files and persists one small JSON preset file.

- `server.js` — dependency-free HTTP server. Serves `public/` as static files with SPA-style fallback to `index.html` on 404. Exposes three JSON routes: `GET/POST /api/prep-formats` (reads/writes `data/prep-formats.json`, the user's saved number/currency/percent/date format presets) and `GET /api/health`.
- `public/index.html` — shell containing two views toggled via `.hidden`: the drop/import screen (`#editor-dropscreen`) and the editor (`#csv-editor-modal`). Loads `public/js/editor-core.js` as the sole module entry point.
- `public/js/editor-core.js` — all UI logic and state (module-level `_csv`, `_selCols`, `_activeTool`, `_prepHistory`/`_redoHistory`, etc.). Renders the paginated table, the tool sidebar, and per-tool panels (`_pSplit`, `_pMerge`, `_pDelete`, `_pFormat`, ...), each wired up by a matching `_w*` function (`_wSplit`, `_wMerge`, ...). Undo/redo works by pushing full CSV snapshots (`_pushHistory`), not diffs.
- `public/js/modules/parser.js` — RFC 4180 CSV/TSV parser and serializer with separator auto-detection (tab > `;` > `,`).
- `public/js/modules/xlsx-parser.js` — XLSX reader implemented from scratch by unzipping the file's raw bytes and using the browser-native `DecompressionStream` (no library). This requires a modern browser (Chrome 80+, Firefox 113+, Safari 16.4+).
- `public/js/modules/prep.js` — all column transformations (split, merge, delete, add, format, case, spaces, replace, etc.) as pure functions: `(csv) => newCsv`, never mutating in place. `editor-core.js` calls these and then reassigns `_csv` to the result.
- `public/js/modules/i18n.js` — ES/EN dictionary; `window.__DATAB_LANG` is set by an inline script in `index.html` before this module loads, so the language is resolved before first render.
- `public/js/modules/utils.js` — DOM/toast helpers shared across the editor.

### Conventions worth knowing

- CSV data model throughout the codebase is `{ headers: string[], rows: string[][], sep: string }`.
- `localStorage` keys (`datab-lang`, `datab-theme`, `editor_*`) are inherited from the parent DataB Flow project and were intentionally left as-is when this editor was split out as a standalone project — don't "fix" the naming without checking for compatibility implications.
- Tool panels in the sidebar follow a consistent pair pattern: a builder function returning HTML (`_p<Tool>`) and a wiring function attaching event listeners (`_w<Tool>`), dispatched from `_buildPanel`/`_wirePanelEvents`.
