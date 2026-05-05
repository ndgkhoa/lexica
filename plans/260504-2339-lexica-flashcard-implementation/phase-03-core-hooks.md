# Phase 03 — Core Hooks

## Context Links
- Wireframe shuffle logic: lines 469-476
- Wireframe TTS logic: lines 498-526
- Wireframe theme logic: lines 565-569
- Design spec dark mode behavior: design-guidelines §1 (data-theme attr)

## Overview
- Priority: P0
- Status: pending
- Build three pure custom hooks: `useShuffle`, `useSpeech`, `useTheme`. Each ≤ 80 lines.

## Key Insights
- **Shuffle queue**: Fisher-Yates over indices, excluding current. Refill on exhaustion. Must NOT mutate input array.
- **Speech voiceschanged fix**: voices may be empty on first `getVoices()`. Listen to `voiceschanged` and retry once. Never use `setTimeout`.
- **Speech state**: track `isPlaying` via `onstart` / `onend` / `onerror` callbacks. Always call `cancel()` before `speak()` to avoid queueing.
- **Theme persistence**: `localStorage.getItem('lexica-theme')`; fallback to `prefers-color-scheme`. Sync to `<html data-theme>` via `useEffect`.
- Hooks return stable callback refs via `useCallback` so consumers can include them in deps without infinite loops.

## Requirements
- Functional:
  - `useShuffle(words)` → `{ currentIdx, next() }` — Fisher-Yates, excludes current on refill
  - `useSpeech()` → `{ speak(text), cancel(), isPlaying }` — voiceschanged-safe
  - `useTheme()` → `{ theme, toggle() }` — persists to localStorage, syncs `<html data-theme>`
- Non-functional:
  - All hooks SSR-safe (`typeof window` guards where needed)
  - Each file < 100 LOC

## Architecture
```
src/hooks/
├── use-shuffle.ts    # Fisher-Yates queue
├── use-speech.ts     # SpeechSynthesis wrapper
└── use-theme.ts      # localStorage + data-theme sync
```

## Related Files
**Create:**
- `src/hooks/use-shuffle.ts`
- `src/hooks/use-speech.ts`
- `src/hooks/use-theme.ts`

**Modify:** none yet.

## Implementation Steps

### `use-shuffle.ts`
All hook files import using `@/` alias, e.g. `import type { Word } from '@/types/word'`.

1. Signature: `useShuffle(words: Word[]): { currentIdx: number; next: () => void }`.
2. Internal state: `queue: number[]` (refs ok via `useRef`), `currentIdx: number` (state).
3. Helper `buildQueue(excludeIdx: number, total: number): number[]` — array of indices `[0..total-1]` filter `!== excludeIdx`, Fisher-Yates in-place, return.
4. Initial: when `words.length` becomes > 0 first time, build queue with `excludeIdx = -1`, pop first into `currentIdx`.
5. `next` callback: if queue empty, rebuild excluding current; pop; setCurrentIdx.
6. Memoize `next` with `useCallback`.

### `use-speech.ts`
1. Signature: `useSpeech(): { speak: (text: string) => void; cancel: () => void; isPlaying: boolean }`.
2. State: `isPlaying` boolean.
3. `speak(text)`:
   - Guard: if `!('speechSynthesis' in window)`, return.
   - `cancel()` first.
   - Build `SpeechSynthesisUtterance(text)` with `lang='en-US'`, `rate=0.85`.
   - Hook `onstart` → `setIsPlaying(true)`; `onend` & `onerror` → `setIsPlaying(false)`.
   - If `getVoices().length === 0`: `addEventListener('voiceschanged', once)` then call `speechSynthesis.speak(utter)` inside `once`. Else speak immediately.
4. `cancel()`: `speechSynthesis.cancel()`, `setIsPlaying(false)`.
5. Cleanup on unmount: cancel + remove voiceschanged listener.

### `use-theme.ts`
1. Signature: `useTheme(): { theme: 'light' | 'dark'; toggle: () => void }`.
2. Init via lazy `useState(() => ...)`:
   - SSR guard: `typeof window === 'undefined'` → return `'light'`.
   - Read `localStorage.getItem('lexica-theme')`; if `'light' | 'dark'` use it.
   - Else `window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'`.
3. `useEffect` on `theme` change: `document.documentElement.setAttribute('data-theme', theme)` + `localStorage.setItem('lexica-theme', theme)`.
4. `toggle` via `useCallback`: `setTheme(t => t === 'dark' ? 'light' : 'dark')`.

## Todo
- [ ] Implement `use-shuffle.ts` with Fisher-Yates queue
- [ ] Implement `use-speech.ts` with voiceschanged fix
- [ ] Implement `use-theme.ts` with localStorage + data-theme sync
- [ ] Verify TS strict pass on all three
- [ ] Manually test in browser console (temp wired into App.tsx placeholder)
- [ ] Pre-commit gate: `bun run build && bun run lint && bun run check` — all must pass
- [ ] Commit: `feat: core hooks (shuffle, speech, theme)`

## Success Criteria
- Calling `next()` 100× never returns same index twice in a row.
- First-load `speak('hello')` actually speaks (voices loaded asynchronously).
- Toggling theme persists across page reload.
- TS reports zero errors; no console warnings on mount/unmount.

## Risks
- **Speech queueing** — calling speak twice rapidly: solved by `cancel()` first.
- **Speech voiceschanged not firing** (Firefox quirk) — voices populate synchronously there, so the immediate-path covers it.
- **localStorage SSR** — guard with `typeof window` even though Vite is CSR-only (future-proofing).
- **Stale closure in voiceschanged once-listener** — capture `text` in closure scope.

## Security
- `speechSynthesis` is an unprivileged browser API; no concerns.
- `localStorage` value is `'light' | 'dark'` only; no PII.

## Next Steps
- Phase 4 consumes all three hooks in components.
