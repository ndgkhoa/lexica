# Tech Stack — Lexica

## Core
- **React 19.2.5** + **TypeScript ^6.0.2** — component model, type safety (TS 6 defaults strict mode, ESNext target)
- **Vite 8.0.10** — Rolldown bundler, HMR, native JSON import
- **@vitejs/plugin-react ^6.0.1** — Oxc-based Fast Refresh
- **@types/node 25.6.0** — Node.js type definitions (vite.config.ts)
- **Bun 1.x** — runtime, package manager, test runner

## Styling
- **Tailwind CSS 4.2.4** + **@tailwindcss/vite 4.2.4** — utility-first; Vite plugin replaces PostCSS
- **CSS Modules** — scoped 3D flip animation (backface-visibility, perspective)

## Fonts (Google Fonts)
- **Crimson Pro** — serif, vocabulary word display (72–96px)
- **IBM Plex Sans** — humanist sans, definitions & UI (16–20px)

## Features
- **Web Speech API** (native) — SpeechSynthesis for TTS, no external lib
- **Fisher-Yates shuffle** — uniform random card order
- **Local JSON** — vocabulary data in `public/words.json`, loaded via `fetch()` at runtime (keeps bundle lean; browser-cached on repeat visits; supports 3,000+ words)

## State
- **useState + useCallback** — sufficient for card index, flip state, shuffle
- No Redux / Zustand — overkill for single-screen app

## Code Quality
- **Biome 2.4.14** — single tool for linting + formatting (replaces ESLint + Prettier); schema `2.4.14`; `biome.json` in root

## Testing
- **Vitest** — fast unit tests, Vite-native
- **React Testing Library** — component behavior tests

## Why This Stack
- Zero animation lib dependencies (CSS handles 3D flip natively, GPU-accelerated)
- Zero TTS lib (Web Speech API baseline-stable across all modern browsers)
- Minimal bundle: just React + Vite + Tailwind
- Bun as drop-in npm/pnpm replacement — faster installs, native TS execution
- TypeScript from day 1 → prevents runtime errors in shuffle/speech logic
