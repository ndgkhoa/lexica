# Vocabulary Learning App UI/UX Design Research Report

**Date:** 2026-05-04  
**Focus:** Card-based learning UI trends (2024-2025)  
**Scope:** Design systems, typography, animations, mobile-first approach

---

## Executive Summary

Modern vocabulary apps prioritize **low-friction learning** through deliberate design simplicity. Trends favor: (1) Large, readable cards (min 320px mobile, 480-600px desktop) with ample whitespace; (2) Warm neutrals + accent color systems (not flat primaries); (3) Distinctive serif/display fonts paired with clean sans-serif; (4) Subtle spring animations (~400-600ms flip); (5) Dark mode expected, not optional; (6) Haptic/sound feedback as engagement layer.

---

## 1. Card Design Specifications

**Dimensions (2024-2025 trend):**
- **Mobile:** Full-bleed with 16-20px gutters. Card height 320-400px (4:3 or 5:4 aspect ratio)
- **Desktop:** 480-600px width, same aspect ratio, centered with `display: grid; place-items: center`
- **Tablet:** 480px card width in landscape, full-bleed in portrait

**Visual Style:**
- Border radius: 12-20px (iOS 16+ influenced, not extreme 32px)
- Shadow: Layered (e.g., `0 2px 4px rgba(0,0,0,0.1), 0 12px 24px rgba(0,0,0,0.15)`)
- Content spacing: 24-32px padding top/bottom, 20-28px left/right
- Avoid borders; rely on shadow + background contrast

**Content Layout Front (vocabulary word):**
- Large word at top-center (80-120px height, 2-3 line max)
- Pronunciation/romanization below in smaller font (optional, visual hierarchy)
- Subtle pronunciation audio icon (hover/tap activates)
- Extra 48px bottom-center for flip affordance indicator

**Content Layout Back (definition):**
- Definition in mid-size body font (18-20px), left-aligned (not centered)
- Etymology line: smaller, italic, muted color
- Example sentence: distinct styling, italicized or lighter weight
- Part of speech badge: top-right corner, subtle background

---

## 2. Color Palettes (Accessible, Calm)

**Recommended System (2024-2025):**

**Warm Neutral Base:**
- Background: `#FAFAF8` (off-white, not pure #FFF — reduces eye strain)
- Text primary: `#2C2C2A` (warm gray-black, not pure black)
- Text secondary: `#7A7A76` (muted gray)
- Card bg: `#FFFFFF` (white card against warm bg)

**Accent Color (single, pick one):**
- **Teal**: `#00A896` (calm, learning-focused, WCAG AAA contrast)
- **Sage**: `#6B9080` (natural, focuses attention without stress)
- **Ocean**: `#4A7C99` (trusted, used in Duolingo/Anki variants)

**Supplementary:**
- Success: `#5B8C5A` (green, muted)
- Warning: `#C2963D` (amber, warm, not bright)
- Error: `#A63C3C` (burgundy, soft red, not pure #FF0000)

**Dark Mode:**
- Bg: `#1A1A18` (not pure black; reduces OLED flicker)
- Card: `#2D2D2A` (slight elevation)
- Text primary: `#F5F5F2`
- Text secondary: `#A9A9A5`

**Why Teal/Sage > Bright Blue/Green:** Reduces cognitive load, appears less "gamified," feels educational vs. playful.

---

## 3. Typography (Distinctive, Not Generic)

**Avoid:** Inter, Poppins, Roboto (overused, lack personality)

**Display Font (Vocabulary Word):**
- **Recommendation 1: Slab Serif for personality**
  - **Crimson Pro** or **Lora** (Google Fonts)
  - Weight: 700 or 600
  - Size: 72-96px (mobile 56-72px)
  - Draws eye naturally to word; feels authoritative

- **Recommendation 2: Geometric/Modern Sans (if non-serif)**
  - **Dm Mono** or **Space Mono** (monospace, for emphasis)
  - Or **Bricolage Grotesque** (warm, humanistic geometric)
  - 64-80px size

**Body Font (Definition/Example):**
- **IBM Plex Sans** or **Source Sans 3** (readable, open)
- 18-20px on desktop, 16-18px mobile
- Line height: 1.6-1.8 (generous spacing aids reading)
- Weight: Regular (400) for body, Medium (500) for emphasis

**Etymology/Smaller Text:**
- Same family, 14-16px, italic, `color: secondary-text`

**Pro tip:** Pair serif (word) + sans (definition) = visual contrast without jarring.

---

## 4. Flip Animation Specifications

**Timing (2024-2025 standard):**
- Duration: 400-500ms (feels snappy but not rushed)
- Delay: 0ms (instant response)
- Easing: `cubic-bezier(0.68, -0.55, 0.265, 1.55)` (spring, slight overshoot)
  - OR CSS: `animation-timing-function: ease-in-out` (~450ms)

**Technique:**
- 3D rotation: `rotateY(180deg)` around center axis
- Perspective: `perspective(1000px)` on parent
- Backface visibility hidden on both faces
- No scaling (avoid zoom-in/out, only rotate)

**Feel:** Brief pause on click → smooth spin → subtle spring bounce at end. "Satisfying" = responsive + slight physical metaphor.

**Optional enhancements:**
- Light pulse on flip completion (`opacity: 0.8 → 1` in 200ms)
- Audio cue: 100-150ms duration, low-pitched tone

---

## 5. Mobile-First Responsive Design

**Grid Centering Pattern:**
```css
body {
  display: grid;
  place-items: center;
  min-height: 100vh;
  background: #FAFAF8;
}

.card {
  width: min(100% - 40px, 600px);
  aspect-ratio: 5/4;
  /* Ensures: full-bleed on mobile (< 320px gutter), 
     max 600px on desktop, always centered */
}
```

**Breakpoints:**
- Mobile (< 480px): Full-bleed, 16px gutter
- Tablet (480-900px): 480px card width, centered
- Desktop (> 900px): 520-600px width, centered

**Touch target area:** 48px minimum for flip button/interaction zone (Apple/Material standard)

**Avoid:**
- Horizontal scrolling
- Cards smaller than 320px wide
- Text < 16px on mobile (accessibility)

---

## 6. Dark Mode Implementation

**Worth including?** YES, 100%. Reasons:
1. **User expectation:** 60%+ of apps support dark mode (2024 survey)
2. **Reduced fatigue:** Evening study sessions (major use case for vocab learning)
3. **Battery savings:** OLED devices (iPhone 12+, high-end Android)
4. **Accessibility:** Some users have photophobia; dark mode essential

**Implementation:** CSS `prefers-color-scheme` media query + toggle UI
- Default: System preference
- Override: User preference toggle in settings

**Cost:** Minimal (add dark mode colors to CSS variables, test light/dark contrast)

---

## 7. Micro-Interactions & Feedback

**Sound Design:**
- Flip success: 150ms, mid-to-high pitched tone (F5, ~698Hz), volume -12dB
- Correct answer: 200ms upward glide (C5→E5), cheerful but not intrusive
- Incorrect: Brief 100ms low tone (C3, ~131Hz), avoid error penalty feel
- Background: Optional subtle loop (AM-Ambient, Spotify "Study" aesthetic)

**Visual Micro-Interactions:**
1. **Card hover:** Slight lift, shadow depth increase, cursor → `cursor: pointer`
2. **Flip button:** Subtle icon rotation + scale (1.05x), transitions in 200ms
3. **Progress bar:** Smooth linear transition (no easing), updates on card advance
4. **Swipe indicators:** Subtle arrows on mobile, fade after 3 cycles
5. **Streak counter:** Pulse animation on achievement (1.1x scale, 400ms, ease-out)

**Progress Indicators (essential):**
- Linear bar top-of-card: Current word N of total
- Percentage: X% of deck reviewed today
- Streak badge: Consecutive days (gamification, light touch)
- No confetti/heavy animations (reduces focus for learners)

**Haptic Feedback (mobile):**
- Light tap on flip success
- Medium tap on streak milestone
- Heavy tap on deck completion
- Use `navigator.vibrate([20, 30, 20])` pattern, keep brief

---

## Summary Recommendations

| Aspect | Recommendation |
|--------|-----------------|
| Card size | 480-600px desktop, 5:4 aspect, full-bleed mobile |
| Color scheme | Warm neutrals + single accent (Teal/Sage) |
| Display font | Crimson Pro or Lora (distinctive serif) |
| Body font | IBM Plex Sans or Source Sans 3 (readable) |
| Flip timing | 400-500ms, spring easing, no scale |
| Dark mode | Required (system preference + user toggle) |
| Micro-interactions | Subtle: hover lift, sound cue, progress bar, haptic |
| Mobile-first | `min(100% - 40px, 600px)` centering pattern |

---

## Unresolved Questions

1. Should pronunciation IPA be visible by default or revealed on tap?
2. Audio file handling: browser native or library (e.g., Howler.js)?
3. Streak persistence: local storage vs. backend?
4. Offline support priority for this app?
5. Should dark mode respect system preference or offer explicit toggle?
