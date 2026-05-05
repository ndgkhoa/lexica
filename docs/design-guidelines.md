# Design Guidelines — Lexica

## 1. Color Tokens

### Light Mode
| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#FAFAF8` | App background |
| `--color-surface` | `#FFFFFF` | Card surface, modals |
| `--color-surface-raised` | `#F4F3F0` | Subtle containers |
| `--color-text-primary` | `#2C2C2A` | Headings, word display |
| `--color-text-secondary` | `#6B6B68` | IPA, labels, hints |
| `--color-text-muted` | `#9E9E9A` | Placeholder, disabled |
| `--color-accent` | `#00A896` | CTA, active state, Vietnamese badge |
| `--color-accent-hover` | `#008F7E` | Accent hover |
| `--color-accent-subtle` | `#E0F5F3` | Accent background tint |
| `--color-border` | `#E8E7E4` | Card border, dividers |
| `--color-shadow` | `rgba(44,44,42,0.08)` | Card elevation shadow |

### Dark Mode (`[data-theme="dark"]`)
| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#1A1A18` | App background |
| `--color-surface` | `#252523` | Card surface |
| `--color-surface-raised` | `#2E2E2C` | Subtle containers |
| `--color-text-primary` | `#F0EFEB` | Headings, word display |
| `--color-text-secondary` | `#A8A8A5` | IPA, labels, hints |
| `--color-text-muted` | `#6B6B68` | Placeholder, disabled |
| `--color-accent` | `#00C4B0` | CTA, active state (lighter for dark bg) |
| `--color-accent-hover` | `#00DBC5` | Accent hover |
| `--color-accent-subtle` | `#0D2E2B` | Accent background tint |
| `--color-border` | `#363634` | Card border, dividers |
| `--color-shadow` | `rgba(0,0,0,0.32)` | Card elevation shadow |

---

## 2. Typography

### Font Families
```css
--font-display: 'Crimson Pro', Georgia, serif;   /* vocabulary word */
--font-ui:      'IBM Plex Sans', system-ui, sans-serif; /* all UI chrome */
```

Google Fonts import (both with Vietnamese subset):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=IBM+Plex+Sans:wght@400;500;600&display=swap&subset=vietnamese" rel="stylesheet">
```

### Type Scale
| Role | Font | Size | Weight | Line-height | Usage |
|---|---|---|---|---|---|
| `word-display` | Crimson Pro | 64–80px (clamp) | 400 | 1.1 | Card front: vocabulary word |
| `ipa` | IBM Plex Sans | 16px | 400 | 1.4 | IPA pronunciation string |
| `vietnamese` | IBM Plex Sans | 15px | 500 | 1 | Vietnamese subtitle pill badge |
| `definition` | IBM Plex Sans | 18px | 400 | 1.6 | Card back: definition |
| `example` | Crimson Pro italic | 17px | 400 italic | 1.6 | Card back: example sentence |
| `pos-tag` | IBM Plex Sans | 10px | 600 | 1 | Part-of-speech badge (uppercase) |
| `ui-label` | IBM Plex Sans | 15px | 600 | 1 | "Next Word" button label |

Word display responsive clamp:
```css
font-size: clamp(48px, 8vw, 80px);
```

---

## 3. Spacing Scale

Based on 4px base unit:
```
--space-1:  4px
--space-2:  8px
--space-3:  12px
--space-4:  16px
--space-5:  20px
--space-6:  24px
--space-8:  32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
```

---

## 4. Border Radius

```
--radius-sm:   6px    — badges, tags
--radius-md:   12px   — buttons, input fields
--radius-lg:   20px   — card corners
--radius-full: 9999px — icon buttons, pill badges
```

---

## 5. Shadow Tokens

```
--shadow-card:   0 2px 12px var(--color-shadow)
--shadow-card-hover: 0 8px 32px var(--color-shadow)
--shadow-btn:    0 1px 4px rgba(0,0,0,0.12)
```

---

## 6. Card Component Spec

### Dimensions
- Width: `min(calc(100% - 40px), 560px)` — centered, 20px gutter each side on mobile
- Aspect ratio: `5 / 4` (width:height = 1.25)
- Border radius: `var(--radius-lg)` = 20px
- Background: `var(--color-surface)`
- Border: `1px solid var(--color-border)`
- Box shadow: `var(--shadow-card)`

### Card Container (3D scene)
```css
.card-scene {
  perspective: 1200px;
  width: min(calc(100% - 40px), 560px);
  aspect-ratio: 5 / 4;
}
.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.card-inner.flipped {
  transform: rotateY(180deg);
}
.card-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 20px;
}
.card-back {
  transform: rotateY(180deg);
}
```

### Card Front Layout (top → bottom, vertically centered)
1. Sound icon — top-right corner, 16px from edges, 36×36px
2. Word display — `clamp(40px,9vw,76px)` Crimson Pro, centered
3. IPA — 16px IBM Plex Sans, `--color-text-secondary`, 10px below word
4. Vietnamese badge — 15px IBM Plex Sans 500, teal pill (`--color-accent` text on `--color-accent-subtle` bg), 12px below IPA

### Card Back Layout
1. Word label — top-right, 14px Crimson Pro italic, `--color-text-muted`
2. Part-of-speech badge — top-left of content, accent background, 10px uppercase bold
3. Definition — 18px IBM Plex Sans, leading 1.6
4. Divider — 32px wide, 1px, `--color-border`
5. Example sentence — 17px Crimson Pro italic, `--color-text-secondary`, with quotation marks

---

## 7. Animation Spec

### Card Flip
```
axis:            rotateY (Y-axis, horizontal flip)
duration:        480ms
easing:          cubic-bezier(0.4, 0, 0.2, 1)   /* smooth, no overshoot */
trigger:         card click / tap
gpu:             will-change: transform on .card-inner
                 transform: translateZ(0) on each .card-face
perspective:     1000px on .card-scene; isolation: isolate
```

### Next Word Button Press
```
transform: scale(0.96) translateY(0)
duration:  120ms ease
```

### Dark Mode Toggle
```
Icon cross-fade / rotate: 200ms ease
Background transition:    300ms ease (bg, border, color)
```

### Hover States
```
card hover shadow: var(--shadow-card-hover), 200ms ease
button hover:      background color, 150ms ease
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .card-inner { transition-duration: 0ms; }
  * { transition-duration: 0.01ms !important; }
}
```

---

## 8. Button / Control Specs

### Next Word Button
- Shape: pill, `var(--radius-full)`, height 56px, padding 0 32px
- Background: `var(--color-accent)`; hover `var(--color-accent-hover)`
- Label: "Next Word" + right-arrow icon (16px), white, 15px IBM Plex Sans 600
- Shadow: `0 4px 16px rgba(0,168,150,0.32)`
- Hover: shadow grows, `translateY(-1px)`
- Active: `scale(0.96)`, shadow reduces
- Position: centered below card, 32px gap

### Dark Mode Toggle
- Size: 40 × 40px
- Shape: circle, `var(--radius-full)`
- Icon: sun (light mode) / moon (dark mode), 18px SVG
- Position: top-right of viewport, 20px from edges
- Transition: icon swap 200ms ease

### Sound / Speaker Icon
- Size: 36 × 36px, positioned top-right of card front, 16px from edges
- States:
  - `idle` — speaker icon, `--color-text-muted`
  - `playing` — filled speaker + sound waves, `--color-accent`
- Tap toggles TTS playback; does NOT flip card (`stopPropagation`)

---

## 9. Layout

```
┌─────────────────────────────────┐
│  Lexica          [dark toggle]  │
│                                 │
│         ┌─────────────┐         │
│         │  CARD FRONT │         │
│         │  or BACK    │         │
│         └─────────────┘         │
│                                 │
│         [ Next Word → ]         │
│                                 │
└─────────────────────────────────┘
```

- App: `min-height: 100dvh`, flex column, justify-center, align-center, padding 80px 0 48px
- Main: flex column, gap 32px
- Top bar: fixed, space-between, pointer-events none (children auto)

---

## 10. Accessibility

- All interactive elements have `:focus-visible` outline: `2px solid var(--color-accent)`, offset 2px
- Color contrast: text on bg ≥ 7:1 (AA+), accent on bg ≥ 4.5:1 (AA)
- Card flip triggered by `click` / tap only
- `aria-label` on all icon-only buttons (sound, dark-mode toggle)
- `aria-live="polite"` region announces current word on word change
- `role="button" tabindex="0"` on card scene
- Sound button: `aria-pressed` reflects playing state
- TTS auto-reads on first load via `voiceschanged` event (not setTimeout)
- Minimum touch target 44 × 44px for all interactive elements
