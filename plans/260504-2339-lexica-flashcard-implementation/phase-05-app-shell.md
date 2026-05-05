# Phase 05 — App Shell

## Context Links
- Layout spec: design-guidelines §9
- Top bar / theme toggle / next button: design-guidelines §8
- Wireframe markup: docs/wireframe/index.html lines 336-417

## Overview
- Priority: P0
- Status: pending
- Wire all hooks + components inside `App.tsx`. Add TopBar (logo + theme toggle), NextWordButton, accessibility live region.

## Key Insights
- `App.tsx` is the orchestrator: calls `useWords`, `useShuffle`, `useSpeech`, `useTheme`. Coordinates auto-TTS on word change.
- Auto-TTS effect MUST be debounced/guarded so it fires once per word change — use `useEffect` with `[currentWord.word]` dep, NOT `[currentWord]` (object identity changes).
- TopBar uses `pointer-events: none` on container, `pointer-events: auto` on children — prevents top-bar dead-zones blocking card clicks.
- Loading state: render `null` or skeleton while `loading` true; render error message if `error`.

## Requirements
- Functional:
  - On mount: load words → pick random first → render card → auto-TTS
  - Theme toggle in top-right swaps light/dark
  - "Next Word" button picks new random word, flips card to front, auto-TTS
  - Live region announces current word for screen readers
- Non-functional:
  - `App.tsx` ≤ 120 LOC
  - Each shell component ≤ 60 LOC

## Architecture
```
src/
├── App.tsx                       # orchestrator
├── components/
│   ├── top-bar.tsx               # logo + theme toggle slot
│   ├── theme-toggle.tsx          # sun/moon button
│   └── next-word-button.tsx      # pill button below card
```

## Related Files
**Create:**
- `src/components/top-bar.tsx`
- `src/components/theme-toggle.tsx`
- `src/components/next-word-button.tsx`

**Modify:**
- `src/App.tsx` — replace placeholder with full app

## Implementation Steps

### `theme-toggle.tsx`
1. Props: `{ theme: 'light' | 'dark'; onToggle: () => void }`.
2. 40×40 circle button, `aria-label="Toggle dark mode"`.
3. Show sun icon when `theme === 'light'`, moon icon when `theme === 'dark'`.
4. Hover: surface-raised bg. Active: scale 0.92. Focus-visible: accent outline.

### `top-bar.tsx`
1. Props: `{ children: React.ReactNode }` (theme toggle injected by App).
2. Fixed top: 0/left:0/right:0, padding 16px 20px, flex space-between, `pointer-events: none`, z-10.
3. Left: `<span>Lexica</span>` Crimson Pro 22px 600, `pointer-events: auto`, opacity 0.85.
4. Right slot: child gets `pointer-events: auto` automatically via inline style on its root.

### `next-word-button.tsx`
1. Props: `{ onClick: () => void }`.
2. Pill: `rounded-full h-14 px-8 bg-[var(--color-accent)] text-white text-[15px] font-semibold`.
3. Label "Next Word" + right-arrow SVG (16px, stroke-width 2.5).
4. Hover: `bg-[var(--color-accent-hover)]`, `translateY(-1px)`, larger shadow.
5. Active: `scale-[0.96]`.
6. `aria-label="Load next random word"`.

### `App.tsx`
All shell components and hooks imported via `@/` alias:
```ts
import { useWords } from '@/hooks/use-words';
import { useShuffle } from '@/hooks/use-shuffle';
import { useSpeech } from '@/hooks/use-speech';
import { useTheme } from '@/hooks/use-theme';
import { FlashCard } from '@/components/flash-card/flash-card';
import { TopBar } from '@/components/top-bar';
import { ThemeToggle } from '@/components/theme-toggle';
import { NextWordButton } from '@/components/next-word-button';
```

1. Call hooks in order:
   ```
   const { words, loading, error } = useWords();
   const { currentIdx, next } = useShuffle(words);
   const { speak, cancel, isPlaying } = useSpeech();
   const { theme, toggle } = useTheme();
   ```
2. Derive `currentWord = words[currentIdx]` (guard for `loading || !currentWord`).
3. Auto-TTS effect:
   ```
   useEffect(() => {
     if (!currentWord) return;
     speak(currentWord.word);
     return () => cancel();
   }, [currentWord?.word]);
   ```
4. `handleSoundClick`: if `isPlaying` → `cancel()`; else `speak(currentWord.word)`.
5. Loading: render minimal "Loading…" centered.
6. Error: render error message + accent retry hint.
7. Layout:
   ```
   <>
     <TopBar><ThemeToggle theme={theme} onToggle={toggle} /></TopBar>
     <div aria-live="polite" aria-atomic="true" className="sr-only">{currentWord.word}</div>
     <main className="flex flex-col items-center gap-8 w-full">
       <FlashCard word={currentWord} onSpeak={handleSoundClick} isPlaying={isPlaying} />
       <NextWordButton onClick={next} />
     </main>
   </>
   ```
8. Add `.sr-only` utility in `index.css` if Tailwind doesn't ship one (Tailwind v4 has `sr-only` built in — verify).
9. Body styles in `index.css`: `min-h-screen flex flex-col items-center justify-center pt-20 pb-12`.

## Todo
- [ ] Build `theme-toggle.tsx` with sun/moon SVGs
- [ ] Build `top-bar.tsx` with pointer-events trick
- [ ] Build `next-word-button.tsx`
- [ ] Wire `App.tsx`: hooks + auto-TTS effect + layout
- [ ] Verify in browser: card visible, flip works, next button cycles random, TTS auto-plays, theme persists across reload
- [ ] Pre-commit gate: `bun run build && bun run lint && bun run check` — all must pass
- [ ] Commit: `feat: app shell + integration`

## Success Criteria
- First load: random word displayed in Crimson Pro, TTS plays after voices load.
- Click "Next Word": new random word (no immediate repeat), card resets to front, TTS plays.
- Toggle dark mode: page swaps tokens; reload preserves choice.
- Card click flips; sound button toggles TTS without flipping.
- No console errors; Lighthouse a11y ≥ 95.

## Risks
- **TTS double-fire on first mount** (React 19 strict mode) — `cancel()` in cleanup makes second call a no-op visually; or guard with `useRef` to skip first cleanup-and-respeak. Verify behavior in dev mode.
- **Auto-TTS on tab background** — Chrome may queue speech; not a regression risk.
- **TopBar covering card click** — pointer-events trick mitigates. Test by clicking near top of card.

## Security
- All text rendered via JSX (escape-by-default). No `dangerouslySetInnerHTML`.

## Next Steps
- Phase 6: tests for hooks + FlashCard interactions.
