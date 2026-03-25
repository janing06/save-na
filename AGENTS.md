# SaveNa — Agent Guide

Personal budgeting app for Filipinos built with React Native + Expo. All data stored locally on device via SQLite. No backend, no accounts, no network requests.

---

## Project Layout

```
save-na/
├── client/          # Expo React Native app — all code lives here
├── .github/
│   └── workflows/   # CI (PR checks) + manual EAS builds
└── README.md
```

All work happens inside `client/`. Run every command from there.

---

## Tech Stack

| Purpose | Tool |
|---------|------|
| Framework | Expo SDK 54 + React Native 0.81 |
| Language | TypeScript (strict) |
| Routing | Expo Router (file-based) |
| Database | expo-sqlite (on-device SQLite) |
| Server state | TanStack React Query |
| Global state | Jotai (minimal use) |
| Styling | NativeWind (Tailwind for RN) |
| Lint + format | Biome |
| Architecture validation | steiger (FSD) |
| Dead code | knip |
| Builds | EAS Build (cloud) |

---

## Commands

```bash
cd client

npm start              # Start Expo dev server
npm run ts:check       # TypeScript type check
npm run lint           # Biome lint
npm run lint:fix       # Biome lint with auto-fix
npm run format         # Format code — run this after every code change
npm run fsd            # Validate FSD architecture
npm run knip           # Dead code check
npm run check-all      # Run all quality checks

# Trigger EAS build (from client/)
eas build --platform android --profile preview --non-interactive
```

> **Always run `npm run format` after making code changes, before committing.**

---

## Architecture

### Feature-Sliced Design (FSD)

Features live in `src/pages/`. Each feature slice follows this structure:

```
pages/[feature]/
├── api/           # Raw async functions — touch the DB here only
├── model/hooks/   # React Query hooks wrapping api/ functions
├── ui/            # React components
└── index.ts       # Barrel export
```

### Container / Presentation Pattern

Every screen has two components:

- `*-page-container.tsx` — composes hooks, owns data fetching and mutations, handles side effects
- `*-page.tsx` — pure UI, receives everything via props, no data hooks

### Data Flow

```
api/fn.ts  →  model/hooks/use-fn.ts  →  ui/*-container.tsx  →  ui/*-page.tsx
```

### State

- **React Query** — all database reads and writes
- **useState** — modal visibility, form fields, local filters
- **Jotai** — available but minimal current use

---

## Database

SQLite via `expo-sqlite`. Schema in `src/shared/db/schema.ts`. Initialized in `src/shared/db/client.ts`.

**Tables:** `user_preferences`, `income_source`, `category`, `budget_month`, `budget_item`, `budget_item_allocation`

Key design decisions:
- `year_month` is a `YYYY-MM` string (e.g. `"2026-03"`)
- `pay_dates` and `pay_amounts` on `income_source` are JSON strings
- `split_type` is `'even'` or `'custom'`
- Pay periods are computed in-memory from schedule — not stored in DB
- Migrations in `client.ts` — add new columns there

---

## Path Aliases

Configured in `tsconfig.json`:

| Alias | Resolves to |
|-------|------------|
| `@shared/*` | `src/shared/*` |
| `@pages/*` | `src/pages/*` |
| `@core/*` | `src/core/*` |

---

## Navigation

```
src/app/
├── index.tsx              # Redirects: onboarding or tabs
├── (tabs)/
│   ├── budget.tsx
│   ├── income.tsx
│   └── settings.tsx
└── onboarding/
    ├── welcome.tsx
    ├── currency.tsx
    └── income-source.tsx
```

First-run flow: welcome → currency → income source → tabs.

---

## Code Conventions

- **No `any` types** — use correct types from `src/shared/lib/types.ts`
- **File names**: kebab-case (`budget-page-container.tsx`)
- **Components**: PascalCase (`BudgetPage`)
- **Hooks**: camelCase with `use` prefix (`useBudgetItems`)
- **Query keys**: defined in `src/shared/lib/query-keys.ts` — always use these, never inline strings
- **Errors in mutations**: use `Alert.alert()` for user-facing errors
- **Icons**: Ionicons from `@expo/vector-icons`
- **Styling**: NativeWind className — no StyleSheet unless unavoidable
- **Platform differences**: use `Platform.OS` check — e.g. modals use `fullScreen` on Android, `pageSheet` on iOS

---

## CI

PR checks run automatically on `client/**` changes:

1. TypeScript (`npm run ts:check`)
2. Biome lint (`npm run lint`)
3. FSD validation (`npm run fsd`)
4. Dead code (`npm run knip`)

All must pass before merging.

---

## Git Workflow

- Never commit directly to `main` — always branch first
- One logical change per commit, one logical change per PR — don't bundle refactors with features
- Commit message style: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`)
- Run `npm run format` before committing
- EAS builds only pick up **committed** changes
