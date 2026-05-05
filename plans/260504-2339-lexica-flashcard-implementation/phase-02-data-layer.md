# Phase 02 — Data Layer

## Context Links
- Word data shape: see plan.md "Word data shape"
- Wireframe sample words: `/Users/nguyendangkhoa/workspace/personal/lexica/docs/wireframe/index.html` lines 422-443

## Overview
- Priority: P0
- Status: complete
- Define `Word` type, ship 20-word `public/words.json`, build `useWords` hook with fetch + loading/error state.

## Key Insights
- `words.json` lives in `public/` so Vite serves it untouched at `/words.json`. Allows scaling to 3,000+ words without bundler bloat.
- Browser caches `words.json` on subsequent visits — no manual cache layer needed.
- `useWords` returns `{ words, loading, error }` discriminated state — caller renders accordingly.
- Use `AbortController` to cancel fetch on unmount to avoid React 19 strict-mode double-fire warnings.
- All functions use arrow function syntax for consistency with codebase style guide.

## Requirements
- Functional:
  - JSON file accessible at `/words.json`
  - 20 valid records matching `Word` shape (reuse wireframe seed)
  - Hook handles loading, error, and success states
- Non-functional:
  - Hook < 60 LOC
  - JSON < 8KB at 20 words

## Architecture
```
src/
├── types/
│   └── word.ts            # Word interface
└── hooks/
    └── use-words.ts       # fetch + state
public/
└── words.json             # 20-word seed
```

## Related Files
**Create:**
- `public/words.json`
- `src/types/word.ts`
- `src/hooks/use-words.ts`

**Modify:** none.

## Implementation Steps
1. Author `src/types/word.ts`:
   ```ts
   export interface Word {
     word: string;
     ipa: string;
     pos: string;
     vietnamese: string;
     definition: string;
     example: string;
   }
   ```
2. Convert wireframe `CARDS` array (lines 422-443 of wireframe) to JSON. Save to `public/words.json` as a JSON array of `Word` objects.
3. Validate JSON is parseable: `bun -e 'console.log(JSON.parse(await Bun.file("public/words.json").text()).length)'` → expect `20`.
4. Author `src/hooks/use-words.ts` using `@/` alias for imports and arrow function syntax:
   ```ts
   import type { Word } from '@/types/word';
   
   export const useWords = (): WordsState => {
     // ...
   }
   ```
   - Signature: `useWords(): { words: Word[]; loading: boolean; error: Error | null }`
   - Uses `useEffect` with `AbortController`
   - `fetch('/words.json', { signal })` → `.json()` → cast as `Word[]`
   - On error: store `Error`; on success: store array
   - Cleanup aborts the fetch
5. Confirm `App.tsx` placeholder can call `useWords()` and log length — verify dev console shows `20`.

## Todo
- [x] Define `Word` interface
- [x] Create `public/words.json` (20 records)
- [x] Implement `useWords` hook with abort cleanup
- [x] Verify hook returns 20 words in console
- [x] Pre-commit gate: `bun run build && bun run lint && bun run check` — all must pass
- [x] Commit: `feat: add Word type, words.json seed, useWords hook`

## Success Criteria
- [x] `useWords()` resolves with `words.length === 20` after mount.
- [x] `loading` flips `true → false` exactly once.
- [x] Aborting (unmount during fetch) does NOT log unhandled promise warnings.
- [x] TS compiler reports zero errors.

## Risks
- **JSON quote escaping** — Vietnamese chars + nested single quotes in `example` strings; use double-quote JSON strings and escape inner quotes (or use Unicode `'` / `'` curly quotes).
- **Strict-mode double fetch** — React 19 dev mode double-invokes effects; abort handles it.

## Security
- JSON file is public/static, no PII; safe to commit.

## Next Steps
- Phase 3 hooks consume `words` array.
