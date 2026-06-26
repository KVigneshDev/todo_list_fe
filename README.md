# Todo List — Frontend (React + TypeScript + Tailwind)

Minimal, fast todo UI built with **React 19**, **TypeScript**, **Tailwind CSS**,
and **TanStack Query**. The focus is UX: optimistic updates, keyboard support,
clear empty/loading/error states, and a single consistent theme.

## The theme (single source of truth)

All visual design lives in **[`src/theme/theme.ts`](src/theme/theme.ts)**.
`tailwind.config.ts` imports those tokens, so utility classes like `bg-surface`,
`text-content`, `border-border`, and `bg-accent` are generated directly from the
file. To re-theme the whole app, change `theme.ts` — nothing else.

```
theme.ts  ──imported by──▶  tailwind.config.ts  ──generates──▶  utility classes
        └────────────────── also imported by components for raw values
```

## Structure

```
src/
  theme/theme.ts        # design tokens — the single source of truth
  api/                  # typed HTTP client + task endpoints
  hooks/                # useTasks (queries + optimistic mutations), useDebouncedValue
  lib/                  # query client, className helper
  types/                # shared domain types
  components/
    ui/                 # primitives (Button, Input, Checkbox, IconButton, Toast, Spinner)
    tasks/              # TaskComposer, TaskList, TaskItem, TaskFilterBar, EmptyState
    layout/             # Header
  App.tsx               # composes everything
```

## Features

- **Authentication** — polished login/register screen, JWT stored in
  localStorage, session validated on load, auto sign-out on token expiry, and a
  header account menu. See [`context/AuthContext.tsx`](src/context/AuthContext.tsx).
- **Optimistic updates** — add/complete/edit/delete apply instantly and roll
  back automatically if the request fails.
- **Inline editing** — click a task title to rename it (Enter saves, Esc cancels).
- **Priority** — click the colored dot to cycle low → medium → high.
- **Due dates** — set a due date when adding; tasks show friendly labels
  (Today / Tomorrow / Overdue) with urgency colors.
- **Progress + counts** — a progress bar and per-filter counts, plus a
  "Clear completed" action.
- **Debounced search** + filter tabs (All / Active / Completed) without flicker
  (previous results stay visible while the next load runs).
- **Friendly errors** — failures (including rate-limit `429`s) surface as a toast.
- **Accessible** — labelled controls, keyboard-operable, visible focus rings.

## Requirements

- Node.js 20+ (built and tested on Node 24)

## Quick start

```bash
npm install
npm run dev
```

Open <http://localhost:5173>.

The dev server proxies `/api/*` to the backend at `http://localhost:8000`
(see `vite.config.ts`), so **start the backend first** and no CORS setup is
needed for local development.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check then build for production (`dist/`) |
| `npm run preview` | Preview the production build |
| `npm run typecheck` | Run `tsc` with no emit |

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `""` (relative → dev proxy) | API origin in production, e.g. `https://api.example.com` |

Copy `.env.example` to `.env` to override.
