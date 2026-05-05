# React Flashcard App Best Practices Research

## 1. Card Flip Animation

**Recommendation: CSS 3D Transform + React State (KISS)**

- **CSS 3D Transform**: Native, performant (GPU-accelerated), accessibility-friendly. Use `perspective` + `rotateY` with `backface-visibility: hidden`. Best for production.
- **Framer Motion**: Overkill for simple flip. Best when orchestrating multiple simultaneous animations (cascade, stagger). ~15KB overhead.
- **React Spring**: Physics-based (satisfying but unpredictable timing). Use only if flip duration must sync with gesture velocity.

**Pattern:**
```jsx
<div style={{perspective: '1000px'}}>
  <div style={{transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)', transition: 'transform 0.6s'}}>
    Front/Back content
  </div>
</div>
```

Accessibility: Add `aria-label` describing card state. CSS handles transitions automatically.

---

## 2. State Management

**Recommendation: useState hook (YAGNI)**

No Redux/Zustand needed for single-deck app. Structure:
- `cardIndex`: current position
- `isFlipped`: boolean
- `visitedCards`: Set<index> (don't use array; O(1) lookup)
- `shuffledIndices`: pre-computed array

Keep separate to avoid unnecessary re-renders. Consider `useCallback` for flip/nav handlers.

---

## 3. Random Word Selection (Non-Repeating)

**Recommendation: Fisher-Yates Shuffle (Standard)**

```javascript
function fisherYatesShuffle(array) {
  const arr = [...array]; // immutable
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
```

- **Time**: O(n), **Space**: O(n) copy — acceptable
- Guarantees true uniform distribution (unlike modulo bias)
- For infinite reshuffles: regenerate on deck reset, don't track "visited"

**Alternative**: Index pooling (track remaining indices) — more complex, avoids array copy. Only needed if deck >10K cards.

---

## 4. JSON Data Loading (Vite React)

**Recommendation: Direct import (Simplest)**

```javascript
import words from './data/words.json';
```

Vite treats JSON as ESM automatically. Works in dev/prod. ~5KB overhead included in bundle.

**Alternatives:**
- `import.meta.glob`: Multi-file imports only
- `fetch('/data/words.json')`: Async, adds latency. Use only for >1MB files or runtime-swappable decks

Load in component root or custom hook:
```jsx
const useWords = () => {
  const [words] = useState(() => fisherYatesShuffle(words));
  return words;
};
```

---

## 5. Touch & Click Events

**Recommendation: Use onClick (Unified)**

Both iOS/Android fire onClick after touch detection. No need for separate `onTouchStart`.

**Pattern:**
```jsx
<button 
  onClick={toggleFlip} 
  onKeyDown={(e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      toggleFlip();
    }
  }}
>
```

Why not `onTouchStart`: Adds complexity (prevents click doubling), conflicts with long-press, slower feedback loop.

**Exception**: Swipe detection (next/prev) → Use `onTouchStart` + `onTouchEnd` (simple delta calculation, 20 lines).

---

## 6. Keyboard Accessibility

**Minimum (WCAG AA):**
- Space to flip (preventDefault to avoid scroll)
- ArrowRight/ArrowLeft for next/prev
- ArrowUp/ArrowDown for fast nav (5 cards)
- Tab cycles through interactive elements

```jsx
const handleKeyDown = (e) => {
  switch(e.code) {
    case 'Space':
      e.preventDefault();
      setFlipped(f => !f);
      break;
    case 'ArrowRight':
      goNext();
      break;
    case 'ArrowLeft':
      goPrev();
      break;
  }
};
```

Add `tabIndex={0}` to card container, use semantic HTML (`<button>` for actions).

---

## Implementation Stack (Recommended)

| Feature | Tool | Reason |
|---------|------|--------|
| Flip | CSS 3D | Fast, native, no deps |
| State | useState + useCallback | Simple, no boilerplate |
| Shuffle | Fisher-Yates | Standard, unbiased |
| Data | Direct import | Zero latency, bundled |
| Input | onClick + onKeyDown | Unified, accessible |

**Total deps**: React + Vite. **Bundle overhead**: ~0 (just React).

---

## Unresolved Questions

1. **Deck persistence**: Save progress to localStorage or server? Affects card history tracking.
2. **Multi-deck support**: Load multiple JSON files? Changes state architecture.
3. **Pronunciation audio**: Needed? Adds complexity (audio loading, playback state).
4. **Stats tracking**: Track flip count, time per card? May warrant simple IndexedDB instead of localStorage.
