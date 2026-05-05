---
title: "Lexica Flashcard App Implementation"
description: "Single-screen React vocabulary flashcard app with 3D flip, TTS, dark mode."
status: pending
priority: P2
effort: ~6h
branch: main
tags: [react, typescript, vite, tailwind, flashcards]
created: 2026-05-04
---

# Lexica Implementation Plan

Greenfield React vocabulary flashcard app. Single screen, centered card, 3D flip on tap, auto-TTS via Web Speech API, dark mode persisted to localStorage. Stack: React 19 + TS 6 + Vite 8 + Bun + Tailwind v4 + CSS Modules (flip only).

## Reference Docs
- Design spec: `/Users/nguyendangkhoa/workspace/personal/lexica/docs/design-guidelines.md`
- Tech stack: `/Users/nguyendangkhoa/workspace/personal/lexica/docs/tech-stack.md`
- Wireframe (working reference impl): `/Users/nguyendangkhoa/workspace/personal/lexica/docs/wireframe/index.html`

## Phases

| # | Phase | Status | File |
|---|---|---|---|
| 1 | Project setup (Vite + Bun + React 19 + TS + Tailwind v4 + Fonts) | pending | [phase-01-project-setup.md](./phase-01-project-setup.md) |
| 2 | Data layer (`words.json`, `Word` type, `useWords` hook) | pending | [phase-02-data-layer.md](./phase-02-data-layer.md) |
| 3 | Core hooks (`useShuffle`, `useSpeech`, `useTheme`) | pending | [phase-03-core-hooks.md](./phase-03-core-hooks.md) |
| 4 | FlashCard component (3D flip CSS Module, front/back, sound btn) | pending | [phase-04-flashcard-component.md](./phase-04-flashcard-component.md) |
| 5 | App shell (TopBar, ThemeToggle, NextWordButton, App.tsx) | pending | [phase-05-app-shell.md](./phase-05-app-shell.md) |
| 6 | Tests (Vitest + RTL: hooks + FlashCard flip) | pending | [phase-06-tests.md](./phase-06-tests.md) |

## Dependency Graph
- Phase 1 → 2 → 3 → 4 → 5 → 6 (sequential)
- Phase 4 depends on phase 3 hooks; phase 5 wires everything; phase 6 verifies final output.

## Key Constraints
- YAGNI / KISS / DRY — no state managers, no animation libs, no TTS libs
- CSS Modules used **only** for 3D flip; everything else Tailwind
- Web Speech voices fix: use `voiceschanged` event, NOT `setTimeout`
- Fisher-Yates queue refills with `excludeIdx` to avoid repeating current word
- File size ≤ 200 lines; kebab-case file names
- No mocks in tests where avoidable; real `fetch` mock minimal

## Out of Scope
- Progress bar, nav arrows, card counter, hint text
- User accounts, persistence beyond theme
- Multi-screen routing
- i18n beyond Vietnamese display strings already in data

## Success Criteria
- `bun run dev` shows centered card with random word + TTS auto-plays
- Click flips card 3D (480ms cubic-bezier easing)
- Sound icon toggles TTS without flipping
- "Next Word" → new random word, resets to front, auto-TTS
- Dark mode toggle persists across reload
- All Vitest tests pass; `bun run build` clean
