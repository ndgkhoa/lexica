# Phase 01 — Project Setup

## Context Links

- Tech stack: `/Users/nguyendangkhoa/workspace/personal/lexica/docs/tech-stack.md`
- Design tokens (used in `index.css`): `/Users/nguyendangkhoa/workspace/personal/lexica/docs/design-guidelines.md` §1, §2

## Overview

- Priority: P0 (blocks all other phases)
- Status: complete
- Scaffold Vite 8 + React 19 + TS 6 project under Bun. Wire Tailwind v4 + Google Fonts + Biome 2.4.14. Verify dev server renders.

## Confirmed Versions

| Package                | Version                  |
| ---------------------- | ------------------------ |
| `vite`                 | `8.0.10`                 |
| `@vitejs/plugin-react` | `^6.0.1`                 |
| `typescript`           | `^6.0.2`                 |
| `react` / `react-dom`  | `19.2.5`                 |
| `tailwindcss`          | `4.2.4`                  |
| `@tailwindcss/vite`    | `4.2.4`                  |
| `@types/react`         | `19.2.14`                |
| `@types/react-dom`     | `19.2.3`                 |
| `@types/node`          | `25.6.0`                 |
| `@biomejs/biome`       | `2.4.14` (schema 2.4.14) |

## Key Insights

- Import alias `@/` maps to `src/`. Set in `tsconfig.app.json` (`paths` only — `baseUrl` removed, deprecated in TS 6) and `vite.config.ts` (`resolve.alias`). All subsequent phases use `@/` for internal imports.
- Vite 8 + React 19 + TS 6 strict mode is the baseline target.
- Tailwind v4 uses `@import "tailwindcss"` (no `tailwind.config.js` required); CSS-first config via `@theme` for design tokens.
- Bun replaces npm/pnpm; commands: `bun install`, `bun run dev`, `bun run build`, `bun run test`.
- Google Fonts must be `<link>`-loaded in `index.html` (NOT via Tailwind plugin) to avoid extra deps.
- **Biome 2.4.14** replaces ESLint + Prettier. `noImportantStyles` disabled — `!important` is required in reduced-motion override.
- `@types/node 25.6.0` required by `vite.config.ts` for `path` module and `__dirname`. Added to devDeps + `tsconfig.node.json` `types` field.
- Vite template not used (`bun create vite` cancelled on non-empty dir) — all files written manually.
- `tsconfig.json` is a composite references root; app config lives in `tsconfig.app.json`.

## Requirements

- Functional: working Vite dev server, hot reload, TS strict, Tailwind utilities applied, fonts loading.
- Non-functional: zero unused deps; bundle < 200KB pre-content; first paint < 1s on dev server.

## Architecture

```
lexica/
├── index.html              # fonts + root div
├── package.json            # bun deps + lint/format/check scripts
├── tsconfig.json           # strict, ESNext
├── tsconfig.node.json
├── vite.config.ts
├── biome.json              # Biome v2 lint + format config
├── .gitignore
├── public/
│   └── words.json          # (created phase 2)
├── src/
│   ├── index.css           # Tailwind + design tokens (light + dark via [data-theme])
│   ├── main.tsx            # React root
│   ├── App.tsx             # placeholder "Lexica" until phase 5
│   └── vite-env.d.ts
└── docs/                   # already exists
```

## Related Files

**Created:**

- `package.json`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`
- `biome.json` — Biome 2.4.14, schema `2.4.14`, `noImportantStyles: off`
- `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`
- `src/vite-env.d.ts`, `.gitignore`

**Key deviations from original plan:**

- `tsconfig.app.json` added (Vite 8 composite pattern); `tsconfig.json` is references root only
- `baseUrl` removed from `tsconfig.app.json` (deprecated TS 6 — `paths` entries use `./src/*` relative to tsconfig)
- `@types/node` added + wired via `tsconfig.node.json` `types: ["node"]`
- `biome.json` schema updated to `2.4.14` (resolved from `^2.2.4`)
- `noImportantStyles` disabled globally (reduced-motion `!important` is intentional)

## Implementation Steps

1. `bun create vite . --template react-ts` (in `/Users/nguyendangkhoa/workspace/personal/lexica`); accept overwrites carefully — keep `docs/`, `plans/`, `.git/`.
2. `bun install` initial deps.
3. Add Tailwind v4: `bun add -D tailwindcss @tailwindcss/vite`. Wire into `vite.config.ts` via `tailwindcss()` plugin.
   3a. Add Biome v2: `bun add -D @biomejs/biome`. Init: `bunx biome init`. Replace generated `biome.json` with:
   `json
    {
      "$schema": "https://biomejs.dev/schemas/2.2.4/schema.json",
      "linter": {
        "enabled": true,
        "rules": { "recommended": true, "complexity": { "noImportantStyles": "off" } },
        "domains": { "react": "recommended", "test": "all" }
      },
      "formatter": {
        "enabled": true,
        "indentStyle": "tab",
        "indentWidth": 2,
        "lineWidth": 80,
        "lineEnding": "lf"
      },
      "javascript": {
        "formatter": {
          "semicolons": "always",
          "trailingCommas": "all",
          "quoteStyle": "double"
        }
      }
    }
    `
   Add scripts to `package.json`: `"lint": "biome lint ./src"`, `"format": "biome format ./src --write"`, `"check": "biome check ./src"`
4. Replace `src/index.css` with:
   - `@import "tailwindcss";`
   - `:root { --color-bg: ... }` design tokens (copy from design-guidelines §1 light)
   - `[data-theme="dark"] { --color-bg: ... }` (copy dark)
   - `--font-display`, `--font-ui`, spacing, radius, shadow tokens (§2-5)
   - body uses `var(--font-ui)`, `var(--color-bg)`
   - `@media (prefers-reduced-motion)` rule
5. Update `index.html`:
   - `<html lang="en" data-theme="light">`
   - `<title>Lexica</title>`
   - Google Fonts preconnect + Crimson Pro + IBM Plex Sans (Vietnamese subset) link.
6. Replace `src/App.tsx` with a placeholder showing "Lexica" centered (using Tailwind only) — verifies fonts + tokens.
7. Update `src/main.tsx` to import `./index.css`.
8. Verify TS strict in `tsconfig.json`: `"strict": true`, `"target": "ESNext"`, `"jsx": "react-jsx"`.
   8a. Add import alias in `tsconfig.json` (`compilerOptions`):
   `json
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
    `
   Add matching alias in `vite.config.ts`:
   `ts
    import path from 'node:path';
    // inside defineConfig:
    resolve: { alias: { '@': path.resolve(__dirname, './src') } }
    `
9. Run `bun run dev` — confirm:
   - Page loads at `localhost:5173`
   - "Lexica" displayed in Crimson Pro
   - Background uses `--color-bg`
10. Run `bun run build` — must succeed with zero errors.

## Todo

- [x] Scaffold project files manually (bun create vite cancelled on non-empty dir)
- [x] Install deps: Tailwind 4.2.4, Vite 8.0.10, React 19.2.5, TS 6.0.3, Biome 2.4.14, @types/node 25.6.0
- [x] Configure Biome (`biome.json`), add lint/format/check scripts
- [x] Author `index.css` with full design tokens (light + dark), Biome-formatted
- [x] Wire Google Fonts in `index.html`
- [x] Placeholder `App.tsx` rendering "Lexica"
- [x] Configure `@/` import alias in `tsconfig.app.json` + `vite.config.ts`
- [ ] Verify `bun run dev` serves correctly (visual check)
- [x] Pre-commit gate: `bun run build` ✓ (190KB bundle), `bun run lint` ✓, `bun run check` ✓
- [ ] Commit: `chore: scaffold Vite + React 19 + Tailwind v4 + Biome`

## Success Criteria

- `bun run dev` starts without warnings; page shows styled "Lexica".
- Inspecting `<html>` shows `data-theme="light"`.
- DevTools confirms Crimson Pro font loaded (network tab).
- `bun run build` produces `dist/` cleanly.

## Risks

- **Tailwind v4 API drift** — confirm latest `@tailwindcss/vite` syntax via context7 docs if issues.
- **TS 6 strictness breaks Vite template** — fix any `noUncheckedIndexedAccess` violations as they appear.
- **Bun + Vite plugin compatibility** — fallback to `npm install` if Bun resolution fails on a transitive dep.

## Security

- No external API keys, no secrets. `.env` not needed.

## Next Steps

- Phase 2 (data layer) requires `public/` folder ready; this phase prepares it.
