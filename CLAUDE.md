# SaveNa — Project Context for Claude

Personal budgeting app for Filipinos built with React Native + Expo. All data stored locally on device via SQLite. No backend, no accounts, no network requests.

---

## Working Directory

All code lives in `client/`. Run all commands from there:

```bash
cd client
npm run format     # Run after EVERY code change before committing
npm run ts:check   # TypeScript check
npm run lint       # Biome lint
npm run fsd        # FSD architecture validation
npm run knip       # Dead code check
npm run check-all  # All of the above
```

---

## Architecture

**Feature-Sliced Design (FSD)** with a **container/presentation** pattern.

Each feature in `src/pages/[feature]/` has:
- `api/` — raw async DB functions (only place that touches SQLite)
- `model/hooks/` — React Query hooks wrapping api/ functions
- `ui/` — components; `*-page-container.tsx` composes hooks, `*-page.tsx` is pure UI

Data flow: `api fn → useQuery/useMutation hook → container → page`

Path aliases: `@shared/*`, `@pages/*`, `@core/*` → `src/shared/*`, etc.

---

## Key Conventions

- **No `any` types** — types live in `src/shared/lib/types.ts`
- **Query keys** — always use `src/shared/lib/query-keys.ts`, never inline strings
- **Styling** — NativeWind `className` only, avoid `StyleSheet`
- **Icons** — Ionicons from `@expo/vector-icons`
- **Platform differences** — `Platform.OS` check; modals use `fullScreen` on Android, `pageSheet` on iOS
- **Errors in mutations** — `Alert.alert()` for user-facing errors
- **Formatting** — Biome; tabs, single quotes

---

## Database

SQLite via `expo-sqlite`. Schema: `src/shared/db/schema.ts`. Init + migrations: `src/shared/db/client.ts`.

- `year_month` is a `YYYY-MM` string
- `pay_dates` and `pay_amounts` are JSON strings on `income_source`
- Pay periods are computed in-memory — not stored in DB
- Add new migrations in `runMigrations()` in `client.ts`

---

## Git Rules

- Never commit to `main` directly — always branch first
- One logical change per commit, one per PR
- Commit style: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`)
- Run `npm run format` before every commit
- EAS builds only include **committed** changes

---

## CI

PRs touching `client/**` run automatically: `ts:check` → `lint` → `fsd` → `knip`. All must pass.
