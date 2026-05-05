# Lexica

A minimal flashcard app for vocabulary learning — flip cards, hear pronunciation, and shuffle your word list.

## Features

- **3D flip animation** — click a card to reveal the definition (GPU-accelerated CSS, no animation library)
- **Auto-read on load** — word is spoken aloud via Web Speech API when a new card appears
- **Sound button** — replay pronunciation on demand
- **Shuffle** — Fisher-Yates randomisation of the word list
- **Dark / light theme** — persisted to `localStorage`
- **3,000+ words** — vocabulary data lives in `public/words.json`, browser-cached on repeat visits

## Tech Stack

| Layer | Choice |
|-------|--------|
| UI | React 19 + TypeScript 6 |
| Build | Vite 8 (Rolldown) |
| Styling | Tailwind CSS 4 |
| Fonts | Crimson Pro · IBM Plex Sans |
| TTS | Web Speech API (native) |
| Linting | Biome 2 |
| Testing | Vitest + React Testing Library |
| Runtime | Bun 1.x |

## Getting Started

```bash
bun install
bun run dev
```

Open `http://localhost:5173`.

### Other Commands

```bash
bun run build      # production build
bun run preview    # preview production build
bun run test       # watch mode tests
bun run test:run   # single-run tests
bun run lint       # Biome lint
bun run check      # Biome lint + format check
```

## Project Structure

```
src/
├── components/
│   ├── flash-card/      # card with 3D flip
│   ├── next-word-button.tsx
│   ├── sound-button.tsx
│   ├── theme-toggle.tsx
│   └── top-bar.tsx
├── hooks/
│   ├── use-shuffle.ts   # Fisher-Yates shuffle
│   ├── use-speech.ts    # Web Speech API TTS
│   ├── use-theme.ts     # dark/light toggle
│   └── use-words.ts     # word list fetch + state
├── types/
└── App.tsx
public/
└── words.json           # vocabulary data
```

## License

[MIT](./LICENSE) © 2026 ndgkhoa
