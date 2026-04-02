# Floating Tab Bar — Design Spec

**Date:** 2026-04-02
**Status:** Approved

---

## Goal

Replace the current default React Native tab bar with a floating pill-shaped tab bar that matches the app's teal theme. The active tab shows an icon and label inside a white inner pill; inactive tabs show only the icon. Tab switches are animated.

---

## Visual Design

- **Container:** A horizontally centered, fixed-height pill (height ~60px) with `teal-600` background, rounded corners (`border-radius: 999`), and a subtle drop shadow. Positioned absolutely at the bottom of the screen, `12px` above the safe area bottom inset. Width is auto-sized to its contents (not full-width).
- **Active tab:** A white inner pill containing the tab icon (teal-colored) and the tab label side-by-side, with padding around them.
- **Inactive tabs:** Icon only, white color at ~60% opacity. No label.
- **Spacing:** Equal horizontal padding between tab items inside the container.

---

## Component

**Location:** `client/src/shared/ui/floating-tab-bar.tsx`

**Exported as:** `FloatingTabBar`

**Props:** Receives the standard React Navigation `BottomTabBarProps` (passed automatically by `<Tabs tabBar={...}>`).

**Reads:**
- `usePathname()` from `expo-router` — to hide the bar on `/budget/chat`
- `useSafeAreaInsets()` from `react-native-safe-area-context` — for bottom offset

**Returns `null`** when `pathname === '/budget/chat'` (replaces the existing `hideTabBar` logic in `_layout.tsx`).

---

## Animation

Uses `react-native-reanimated` (already a project dependency).

- **Active pill width:** Animated with `withSpring` — expands to fit icon + label when a tab becomes active, contracts to icon-only width when deactivated.
- **Label opacity:** Animated with `withTiming` (duration ~150ms) — fades from 0 to 1 when active, 1 to 0 when inactive. Prevents the label from popping in abruptly.
- Each tab item manages its own animated values, driven by whether it is the currently focused tab.

---

## Integration

**`_layout.tsx` changes:**
- Remove the `tabBarStyle` / `hideTabBar` logic from `screenOptions`
- Pass `tabBar={(props) => <FloatingTabBar {...props} />}` to `<Tabs>`
- Remove `tabBarActiveTintColor` / `tabBarInactiveTintColor` from `screenOptions` (colors are now owned by the component)

**Tabs (unchanged):** Budget, Income, Settings — same icons, same order.

---

## Constraints

- No new dependencies — uses `react-native-reanimated` and `react-native-safe-area-context`, both already installed.
- NativeWind `className` for static styles; inline `style` only where animated values are needed.
- Must work correctly on both iOS and Android.
- Must not affect the existing content scroll/layout — the floating bar overlays content, so screens need bottom padding equal to tab bar height + bottom inset (approximately 80px).
