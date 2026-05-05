# Phase 04 — FlashCard Component

## Context Links
- Card spec: design-guidelines §6 (front/back layouts), §7 (flip animation)
- Wireframe markup: docs/wireframe/index.html lines 357-407
- Wireframe flip CSS: lines 121-169

## Overview
- Priority: P0
- Status: complete
- Build the centerpiece: 3D-flip flashcard. CSS Modules holds **only** flip styles (perspective, rotateY, backface-visibility). Faces use Tailwind utilities + design tokens.

## Key Insights
- `transform-style: preserve-3d` MUST be on `.cardInner`; faces use `backface-visibility: hidden` + `translateZ(0)` for GPU layers.
- `perspective: 1000px` on outer scene; `isolation: isolate` prevents stacking-context leaks.
- Flip duration 480ms `cubic-bezier(0.4, 0, 0.2, 1)` — smooth, no overshoot.
- Sound button click MUST `e.stopPropagation()` to avoid flipping card.
- Each new word: card auto-resets to front (no animation glitch — see wireframe lines 545-556 for double-rAF trick).
- ARIA: scene is `role="button" tabindex="0"`; live region announces current word; sound button has `aria-pressed`.

## Requirements
- Functional:
  - Click/tap/keyboard (Enter/Space) on card → flip
  - Click on sound button → toggle TTS, NOT flip
  - When `word` prop changes: smoothly reset to front (no flip-back animation)
  - Front: word (Crimson Pro clamp(40px,9vw,76px)), IPA, Vietnamese teal pill badge
  - Back: POS badge (top-left), word label (top-right italic), definition, divider, italic example
- Non-functional:
  - `flash-card.tsx` ≤ 100 LOC
  - `flash-card-front.tsx`, `flash-card-back.tsx` each ≤ 60 LOC
  - CSS Module ≤ 60 lines, flip-only

## Architecture
```
src/components/flash-card/
├── flash-card.tsx              # scene + flip state + sound btn slot
├── flash-card.module.css       # 3D flip ONLY (perspective, transforms, backface)
├── flash-card-front.tsx        # word/IPA/VN badge + sound btn
└── flash-card-back.tsx         # POS/definition/example
```
Sibling component (rendered inside front face):
```
src/components/sound-button.tsx
```

## Related Files
**Create:**
- `src/components/flash-card/flash-card.tsx`
- `src/components/flash-card/flash-card.module.css`
- `src/components/flash-card/flash-card-front.tsx`
- `src/components/flash-card/flash-card-back.tsx`
- `src/components/sound-button.tsx`

**Modify:** none yet (App.tsx wires in phase 5).

## Implementation Steps

### `flash-card.module.css`
1. `.scene` — perspective 1000px, aspect-ratio 5/4, `isolation: isolate`, width `min(calc(100% - 40px), 560px)`, cursor pointer.
2. `.inner` — relative, w/h 100%, `transform-style: preserve-3d`, `will-change: transform`, transition `transform 480ms cubic-bezier(0.4,0,0.2,1)`.
3. `.flipped` — `transform: rotateY(180deg)`.
4. `.face` — absolute inset 0, `backface-visibility: hidden`, `-webkit-backface-visibility: hidden`, `transform: translateZ(0)`, border-radius 20px, transition box-shadow 200ms.
5. `.back` — `transform: translateZ(0) rotateY(180deg)`.
6. `@media (prefers-reduced-motion)` → transition-duration 0ms.

### `flash-card.tsx`
All component files import using `@/` alias, e.g.:
```ts
import type { Word } from '@/types/word';
import styles from './flash-card.module.css'; // relative — same dir, no alias needed
```

1. Props: `{ word: Word; onSpeak: () => void; isPlaying: boolean }`.
2. State: `isFlipped: boolean`. Reset to `false` via `useEffect` on `word.word` change (use double-rAF trick if visual glitch appears).
3. Handlers:
   - `handleFlip()` → toggle `isFlipped`
   - `handleKey(e)` → if `e.key === 'Enter' || e.key === ' '` call `handleFlip()` and `e.preventDefault()`
4. Render: `.scene` with role=button, tabindex=0, aria-label, onClick, onKeyDown
   - `.inner` with conditional `.flipped`
   - `<FlashCardFront>` and `<FlashCardBack>` as `.face` and `.face .back`
5. Pass `onSpeak` and `isPlaying` to front face.

### `flash-card-front.tsx`
1. Props: `{ word: Word; onSpeak: () => void; isPlaying: boolean }`.
2. Layout: SoundButton positioned absolute top-right; centered column with word/IPA/VN-badge.
3. Tailwind classes only (font via `style={{ fontFamily: 'var(--font-display)' }}` for word).
4. Word: `text-[clamp(40px,9vw,76px)] leading-[1.1] tracking-tight text-center`.
5. IPA: `text-base text-[var(--color-text-secondary)]`.
6. VN badge: `text-[15px] font-medium text-[var(--color-accent)] bg-[var(--color-accent-subtle)] rounded-full px-[14px] py-1`.

### `flash-card-back.tsx`
1. Props: `{ word: Word }`.
2. Layout: word label absolute top-right (italic, muted); flex column items-start gap-3.5.
3. POS badge: uppercase 10px, accent color, accent-subtle bg, rounded-sm, px-2.5 py-1, letter-spacing 0.1em.
4. Definition: 18px regular, line-height 1.6, primary color.
5. Divider: 32×1 px, border color.
6. Example: Crimson Pro italic 17px, text-secondary, line-height 1.6.

### `sound-button.tsx`
1. Props: `{ isPlaying: boolean; onClick: () => void; ariaLabel?: string }`.
2. `<button>` absolute top-4 right-4 (16px), 36×36 circle, transparent bg.
3. `onClick`: `e.stopPropagation()` then call `props.onClick()`.
4. Render two SVGs: idle speaker (when `!isPlaying`) and playing speaker filled (when `isPlaying`).
5. `aria-pressed={isPlaying}`.
6. Hover: `hover:bg-[var(--color-accent-subtle)] hover:text-[var(--color-accent)]`.
7. Active: `active:scale-90`.
8. Focus-visible: outline accent.

## Todo
- [x] Author `flash-card.module.css` with flip-only rules
- [x] Build `flash-card.tsx` (scene + flip state + word-change reset)
- [x] Build `flash-card-front.tsx`
- [x] Build `flash-card-back.tsx`
- [x] Build `sound-button.tsx` with `stopPropagation`
- [x] Manually verify in App.tsx: flip works, sound btn does NOT flip, fonts correct
- [x] Pre-commit gate: `bun run build && bun run lint && bun run check` — all must pass
- [x] Commit: `feat: FlashCard component with 3D flip`

## Success Criteria
- Click on card body flips smoothly (480ms).
- Click sound button: TTS toggles, card does NOT flip.
- Pressing Enter or Space on focused card flips it.
- Word change auto-resets to front without visible flip-back animation.
- All design tokens render correctly in light & dark mode.

## Risks
- **Flip-back glitch on word change** — apply double-rAF transition reset (wireframe lines 545-556).
- **Backface flicker** in Safari — ensure both `backface-visibility: hidden` AND `-webkit-backface-visibility: hidden` present.
- **Sound button click bleeding to card** — `e.stopPropagation()` mandatory; verify with dev tools event listener.

## Security
- No user input rendered as HTML; all text via `textContent`/JSX text. No XSS surface.

## Next Steps
- Phase 5 wires App.tsx with hooks + this component.
