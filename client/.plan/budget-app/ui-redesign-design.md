# SaveNa UI Redesign — Design Document

**Date:** 2026-03-22
**Scope:** Visual redesign of all screens (Budget, Income, Settings, Onboarding). No logic changes except where noted.

---

## Design System

### Color Tokens

Use raw Tailwind utility classes throughout — do **not** add custom tokens to `tailwind.config.ts`.

| Purpose | Tailwind class | Hex |
|---|---|---|
| Primary accent | `bg-teal-600` / `text-teal-600` | `#0d9488` |
| Primary light bg | `bg-teal-50` | `#f0fdfa` |
| Screen background | `bg-slate-100` | `#f1f5f9` |
| Card background | `bg-white` | `#ffffff` |
| Text primary | `text-slate-900` | `#0f172a` |
| Text secondary | `text-slate-500` | `#64748b` |
| Text muted | `text-slate-400` | `#94a3b8` |
| Divider / border | `border-slate-200` | `#e2e8f0` |
| Inner divider | `border-slate-100` | `#f1f5f9` |
| Income amount | `text-green-600` | `#16a34a` |
| Allocated amount | `text-amber-600` | `#d97706` |
| Remaining amount (positive) | `text-teal-600` | `#0d9488` |
| Remaining amount (negative) | `text-red-500` | `#ef4444` |
| Category accordion total (Expenses) | `text-red-500` | `#ef4444` |
| Category accordion total (Savings / Investments / Wants) | `text-green-600` | `#16a34a` |

> **Remaining amount color:** Positive remaining → `text-teal-600`. Negative remaining (over-allocated) → `text-red-500`. This preserves the existing conditional color logic in `summary-card.tsx`.

### Typography

- **Screen title / hero amount**: `text-xl font-bold` or `text-2xl font-extrabold`
- **Section label**: `text-xs font-bold tracking-widest text-slate-400 uppercase`
- **Card primary text**: `text-sm font-semibold text-slate-900`
- **Card secondary text**: `text-xs text-slate-500`
- **Amount**: `text-sm font-bold` (color per table above)

### Elevation

- **Cards**: `shadow-sm` (system default light shadow)
- **FAB**: `shadow-lg` — additionally apply `style={{ shadowColor: '#0d9488' }}` inline for the teal-tinted shadow on Android
- **Modal**: `shadow-xl` bottom sheet

### Radius

- **Cards / grouped rows**: `rounded-2xl`
- **Pill buttons / tags**: `rounded-full`
- **Content area over banner**: `rounded-t-3xl` (top corners only, applied to the white slide-up `View`)

---

## Layout Pattern: Teal Banner + White Slide-Up

All main screens (Budget, Income, Settings) share this structure. Implemented as follows:

```tsx
// Outer container — full screen, teal background fills behind status bar
<View className="flex-1 bg-teal-600">
  <SafeAreaView edges={['top']} className="bg-teal-600">
    {/* Teal banner content: nav, title, hero card */}
  </SafeAreaView>

  {/* White content slides up over teal via negative margin */}
  <View className="flex-1 bg-slate-100 rounded-t-3xl -mt-4 overflow-hidden">
    <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 80 }}>
      {/* filters, list, cards */}
    </ScrollView>
  </View>
</View>
```

Key points:
- The outer `View` is `bg-teal-600` so the status bar area is teal (no white peek).
- `SafeAreaView` with `edges={['top']}` handles the notch/status bar without cutting off the teal.
- The white slide-up `View` uses `-mt-4` (negative margin) and `rounded-t-3xl` to overlap the teal.
- Bottom safe area is handled via `contentContainerStyle={{ paddingBottom: 80 }}` on the ScrollView (or via `SafeAreaView edges={['bottom']}` on the tab bar wrapper — already handled by Expo Router's tab layout).

---

## Budget Screen

### Teal Banner
- Month navigation row: `‹  March 2026  ›` — `text-white`, chevrons are `‹` / `›` Unicode characters styled `text-white/80 text-lg`.
- Source switcher (income source pills): horizontal `ScrollView horizontal showsHorizontalScrollIndicator={false}`, immediately below month nav.
- Hero summary card: `bg-white/15 rounded-2xl mx-4 p-4 mt-2` (NativeWind v4 opacity shorthand `bg-white/15`).
  - Three columns side by side: **INCOME** | **ALLOCATED** | **REMAINING** — labels `text-[10px] text-white/65 tracking-widest uppercase`, amounts `text-xl font-extrabold text-white`.
  - Remaining amount: `text-white` always (on dark teal bg both positive/negative are readable in white; the color distinction only matters in the white content area).
  - Progress bar below amounts: outer `bg-white/25 h-1.5 rounded-full`, inner fill `bg-white h-1.5 rounded-full` with `width` set as a percentage style. Caption: `text-[10px] text-white/75 mt-1`.

### White Content Area (Slide-Up View)
- **Source switcher**: already in teal banner — move it there (currently rendered inside the white area).
- **Pay period toggle**: horizontal scroll of pill buttons. Active pill: `bg-teal-600 text-white rounded-full px-4 py-1.5 text-xs font-semibold`. Inactive pill: `bg-white text-slate-500 border border-slate-200 rounded-full px-4 py-1.5 text-xs`.
- **Category accordions**: white `rounded-2xl shadow-sm mx-4 mb-3` cards.
  - Header row: category name `text-sm font-bold text-slate-900` left, amount right colored per category type (Expenses → `text-red-500`, all others → `text-green-600`), then a separate `›` / `‹` character `text-slate-400 text-xs` as the far-right element. Replace the existing inline `▼` / `▶` emoji with `›` when collapsed and `‹` when expanded. No icon library needed.
  - Expanded rows: separated from header by `border-t border-slate-100 mt-2 pt-2`. Each item: name left `text-xs text-slate-700`, amount right `text-xs font-semibold text-slate-700`. Paid items: `line-through text-slate-400` (existing behavior preserved).
- **FAB**: `w-12 h-12 rounded-full bg-teal-600 items-center justify-content shadow-lg` + inline `style={{ shadowColor: '#0d9488' }}`. Positioned `absolute bottom-6 right-6`. **Hidden when `selectedSourceId === 'total'`** — preserve existing conditional render logic.

---

## Income Screen

### Teal Banner
- Left: "Income Sources" `text-white text-xl font-bold`
- Right: sum of all income sources formatted as currency, `text-white/80 text-sm`. This is a new UI element — compute it as `incomes.reduce((sum, s) => sum + s.amount, 0)` and format with `formatCurrency`. Show `₱0` / empty string if no sources.

### White Content Area
- **Income source cards**: `bg-white rounded-2xl shadow-sm mx-4 mb-3 px-4 py-3`.
  - Left column: source name `text-sm font-bold text-slate-900`, pay schedule label below `text-xs text-slate-500`.
  - Right: amount `text-base font-bold text-green-600`.
- **Empty state**: "No income sources yet.\nTap + to add one." centered, `text-slate-400 text-sm text-center mt-16`.
- **FAB**: same teal FAB as budget screen, `absolute bottom-6 right-6`.

---

## Settings Screen

### Teal Banner
- "Settings" `text-white text-xl font-bold`. No other content.

### White Content Area — Grouped Sections

**Section label pattern**: `text-xs font-bold tracking-widest text-slate-400 uppercase mx-4 mb-1.5 mt-4`

**Currency group** (single card):
```
bg-white rounded-2xl shadow-sm mx-4 mb-3
  Row: "Currency"  |  "₱ PHP" text-teal-600 font-semibold  ›
```
Tapping opens the existing currency picker modal (see Modals section).

**Categories group** (single card, rows stacked inside):
```
bg-white rounded-2xl shadow-sm mx-4 mb-3 overflow-hidden
  Row 1: "Expenses"   ›  — border-b border-slate-100
  Row 2: "Savings"    ›  — border-b border-slate-100
  Row 3: "Investments" › — border-b border-slate-100
  Row 4: "Wants"      ›
```
Each row: `px-4 py-3 flex-row justify-between items-center`. Category name `text-sm text-slate-900`. Chevron `›` `text-slate-400`.
Long-press on a row → delete (existing behavior preserved). Tap → rename (existing behavior preserved).

**Add Category** — separate card below the group (structural change to `category-list.tsx`):
```
bg-white rounded-2xl shadow-sm mx-4 mb-3
  Row: [teal-50 circle with + icon]  "Add Category" text-teal-600 font-semibold
```
Replace the current `+ Add` header button with this card row.

**Version string**: `SaveNa v1.0.0` `text-xs text-slate-300 text-center mt-6 mb-4`.

---

## Tab Bar

Update the Expo Router tab layout (`src/app/(tabs)/_layout.tsx`) tab bar colors:
- `tabBarActiveTintColor`: `#0d9488`
- `tabBarInactiveTintColor`: `#94a3b8`
- `tabBarStyle`: `backgroundColor: '#ffffff'`, `borderTopColor: '#e2e8f0'`

---

## Onboarding Screens

Onboarding uses a simpler layout — no teal banner, full-screen centered design.

**Welcome screen**:
- Full screen `bg-white flex-1 items-center justify-center px-8`.
- App name `text-4xl font-extrabold text-teal-600 mb-2`.
- Tagline `text-base text-slate-500 text-center mb-12`.
- "Get Started" button: full-width `bg-teal-600 rounded-full py-4 text-white font-bold text-base`.

**Currency picker screen**:
- Header: "Choose your currency" `text-xl font-bold text-slate-900 mb-4`.
- List rows: each currency row has a teal checkmark `✓ text-teal-600` on the right when selected, replacing the current blue border highlight.
- "Next" button pinned to bottom: `bg-teal-600 rounded-full py-4 text-white font-bold`.

**Income source form screen**: same treatment as the income source modal (see Modals).

---

## Modals / Bottom Sheets

All create/edit modals keep `presentationStyle="pageSheet"` — the OS renders the drag handle automatically on iOS. No custom handle bar needed.

Internal layout:
- Background `bg-white`, `rounded-t-3xl` (already applied by pageSheet on iOS; add manually for Android if needed).
- Modal title: `text-lg font-bold text-slate-900` left, `✕` close button `text-slate-400 text-lg` right.
- `TextInput` fields: `bg-slate-50 rounded-xl px-4 py-3 text-slate-900 border border-slate-200`. Focus state: `border-teal-600` (apply via `onFocus`/`onBlur` state).
- Picker / segmented controls: teal active state, slate inactive.
- Primary action button: `bg-teal-600 rounded-xl py-4 text-white font-bold text-base w-full mt-4`.
- Destructive action (delete): `text-red-500 font-semibold text-sm text-center mt-3`.

**Currency picker modal** (opened from Settings): selected currency row gets `text-teal-600 font-semibold` and a `✓` checkmark, replacing current `bg-blue-50 border-blue-600` highlight.

---

## Empty States

| Screen | Message | Style |
|---|---|---|
| Budget — no items | "No budget items yet.\nTap + to add one." | `text-slate-400 text-sm text-center mt-16` |
| Income — no sources | "No income sources yet.\nTap + to add one." | `text-slate-400 text-sm text-center mt-16` |
| Settings — no categories | "No categories yet." | `text-slate-400 text-sm text-center mt-8` |

---

## What Does NOT Change

- All data logic, hooks, API calls, SQLite queries
- Component architecture (container/presentational split)
- Navigation structure (Expo Router file layout)
- Accordion expand/collapse behavior
- Pay period filtering logic
- FAB hidden when `selectedSourceId === 'total'` (budget screen)
- Long-press delete on categories and income sources
- Modal `presentationStyle="pageSheet"` and form validation
- The `isPending` loading state (existing ActivityIndicator behavior)
