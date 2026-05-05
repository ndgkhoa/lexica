# Phase 06 — Tests

## Context Links
- Tech stack §Testing: docs/tech-stack.md
- All prior phases — components/hooks under test live in `src/`

## Overview
- Priority: P1
- Status: pending
- Add Vitest + RTL. Unit-test the three hooks (real implementations where feasible) and the FlashCard flip behavior.

## Key Insights
- Vitest is Vite-native; config via `vite.config.ts` (`test:` block) with `environment: 'jsdom'`.
- For `useSpeech`: jsdom lacks `speechSynthesis` — provide a minimal real-shaped stub on `globalThis` in `setupTests.ts`. Stub records calls; we assert on it. NOT a "mock library" — a tiny test double mirroring the API.
- For `useWords`: stub `global.fetch` to return a `Response` with the real seed JSON content. Use `vi.spyOn` to assert it was called with `/words.json`.
- For `useShuffle`: pure logic, no DOM. Assert no immediate repeats over 1000 cycles.
- For FlashCard: `userEvent.click` on scene → flipped class added. `userEvent.click` on sound button → `onSpeak` called, scene class unchanged (proves `stopPropagation`).

## Requirements
- Functional:
  - `useShuffle` test: 1000 next() calls, no immediate consecutive repeats
  - `useSpeech` test: voiceschanged path triggers speak when voices empty initially
  - `useWords` test: returns 20 words after fetch; sets error on rejected fetch
  - `<FlashCard>` flip test: click toggles `.flipped`; sound btn click does NOT flip
- Non-functional:
  - All tests run under 5s
  - Coverage of hooks ≥ 80%

## Architecture
```
src/
├── hooks/
│   ├── use-shuffle.test.ts
│   ├── use-speech.test.ts
│   └── use-words.test.ts
├── components/flash-card/
│   └── flash-card.test.tsx
└── test/
    └── setup.ts            # jsdom + speechSynthesis stub
vite.config.ts              # test config
```

## Related Files
**Create:**
- `src/test/setup.ts`
- `src/hooks/use-shuffle.test.ts`
- `src/hooks/use-speech.test.ts`
- `src/hooks/use-words.test.ts`
- `src/components/flash-card/flash-card.test.tsx`

**Modify:**
- `vite.config.ts` — add `test` config block
- `package.json` — add `"test": "vitest"`, `"test:run": "vitest run"`
- `tsconfig.json` — include vitest globals

## Implementation Steps

1. Install dev deps: `bun add -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom`.
   All test imports use `@/` alias:
   ```ts
   import { useShuffle } from '@/hooks/use-shuffle';
   import { useWords } from '@/hooks/use-words';
   import { FlashCard } from '@/components/flash-card/flash-card';
   ```
2. Add to `vite.config.ts`:
   ```ts
   /// <reference types="vitest" />
   test: {
     environment: 'jsdom',
     setupFiles: ['./src/test/setup.ts'],
     globals: true,
   }
   ```
3. `src/test/setup.ts`:
   - `import '@testing-library/jest-dom'`
   - Define minimal `speechSynthesis` stub on `globalThis`:
     ```ts
     const voices: SpeechSynthesisVoice[] = [];
     const listeners: Record<string, Array<() => void>> = { voiceschanged: [] };
     globalThis.speechSynthesis = {
       getVoices: () => voices,
       speak: vi.fn(),
       cancel: vi.fn(),
       addEventListener: (e, cb) => listeners[e]?.push(cb),
       removeEventListener: (e, cb) => { listeners[e] = listeners[e]?.filter(x => x !== cb) ?? []; },
       // dispatch helper for tests
     } as any;
     globalThis.SpeechSynthesisUtterance = class { /* stores props */ } as any;
     ```
4. `use-shuffle.test.ts`:
   - Mount via `renderHook(() => useShuffle(words))` with 5-word array.
   - Loop 1000× call `result.current.next()`; record `currentIdx` history; assert no two adjacent equal.
5. `use-speech.test.ts`:
   - Test 1: voices empty → `speak('hi')` should NOT immediately call `speechSynthesis.speak`. Then dispatch voiceschanged → assert speak was called.
   - Test 2: voices populated → `speak('hi')` calls speak immediately.
6. `use-words.test.ts`:
   - Stub `global.fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify([{...20 words...}])))`.
   - `renderHook(() => useWords())`; `waitFor(() => expect(result.current.loading).toBe(false))`; assert `words.length === 20`.
   - Second test: `fetch` rejects → `error` is set.
7. `flash-card.test.tsx`:
   - Render with sample `word` and stub `onSpeak`.
   - `userEvent.click(scene)` → assert scene's inner has `flipped` class (query by data-testid or class via `closest`).
   - `userEvent.click(soundButton)` → assert `onSpeak` called once, scene inner does NOT have `flipped` class.
8. Run `bun run test:run` — all green.

## Todo
- [ ] Install testing deps
- [ ] Configure Vitest in `vite.config.ts`
- [ ] Author `setup.ts` with speechSynthesis stub
- [ ] Test `useShuffle` (no consecutive repeats)
- [ ] Test `useSpeech` (voiceschanged + immediate paths)
- [ ] Test `useWords` (success + error paths)
- [ ] Test FlashCard flip + sound stopPropagation
- [ ] Verify `bun run test:run` exits 0
- [ ] Pre-commit gate: `bun run build && bun run lint && bun run check` — all must pass
- [ ] Commit: `test: hooks + FlashCard component`

## Success Criteria
- `bun run test:run` exits 0 with ≥ 4 test files passing.
- No skipped tests, no `.only` left in code.
- Hook coverage ≥ 80% per `--coverage` report.
- TS strict still passes for test files.

## Risks
- **jsdom missing Web Speech API** — stub covers it; real browser still uses native.
- **React 19 + RTL compatibility** — confirm `@testing-library/react` ≥ 16 (React 19 support). Adjust if older.
- **Fetch in jsdom** — stub `global.fetch`; do NOT rely on `whatwg-fetch` polyfill.
- **Flaky randomness in shuffle test** — set deterministic seed via `vi.spyOn(Math, 'random')` if flakes appear.

## Security
- No real network in tests. No secrets in setup.

## Next Steps
- Plan complete. Hand back to orchestrator for implementation. Manual QA (visual flip, audio playback) done by human reviewer.
