# SaveNa UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle all screens to a Clean & Light design with a teal accent, using a teal banner + white slide-up layout pattern across Budget, Income, and Settings.

**Architecture:** Pure UI layer changes — classNames and component structure only. No hooks, queries, or business logic are modified. The teal banner pattern is achieved via a `bg-teal-600` outer `View`, a `SafeAreaView` for the top edge, and a white content area with `rounded-t-3xl -mt-4` overlap. No shared wrapper component is introduced — each screen implements the pattern directly.

**Tech Stack:** React Native, NativeWind v4 (Tailwind), `react-native-safe-area-context` (already installed), Expo Router

**Design spec:** `.plan/budget-app/ui-redesign-design.md`

---

## Files Modified

| File | Change |
|---|---|
| `src/app/(tabs)/_layout.tsx` | Tab bar teal active color |
| `src/pages/budget/ui/budget-page.tsx` | Full layout restructure: teal banner + white slide-up |
| `src/pages/budget/ui/month-selector.tsx` | White text on teal |
| `src/pages/budget/ui/source-switcher.tsx` | Teal active pill, white inactive pill |
| `src/pages/budget/ui/summary-card.tsx` | Three-column layout + progress bar (rendered inside teal card) |
| `src/pages/budget/ui/pay-period-toggle.tsx` | Teal active pill, white inactive pill with border |
| `src/pages/budget/ui/category-accordion.tsx` | White card, new chevron, color by type |
| `src/pages/budget/ui/budget-item-row.tsx` | Lighter text, teal-aware paid state |
| `src/pages/budget/ui/budget-item-modal.tsx` | Teal buttons, styled inputs |
| `src/pages/income/ui/income-page.tsx` | Teal banner + white slide-up layout |
| `src/pages/income/ui/income-source-card.tsx` | White card with shadow |
| `src/pages/income/ui/income-source-modal.tsx` | Teal buttons, styled inputs |
| `src/pages/settings/ui/settings-page.tsx` | Teal banner + white slide-up layout |
| `src/pages/settings/ui/category-list.tsx` | Grouped card + separate Add Category card |
| `src/pages/settings/ui/currency-picker.tsx` | Teal selected state |
| `src/pages/settings/ui/category-modal.tsx` | Teal button, styled input |
| `src/pages/onboarding/ui/welcome-page.tsx` | Teal accent, pill button |
| `src/pages/onboarding/ui/currency-page.tsx` | Teal selected row, teal Next button |
| `src/pages/onboarding/ui/income-source-page.tsx` | Teal pills, styled inputs, teal submit |

---

## Task 1: Tab Bar Teal Theme

**Files:**
- Modify: `src/app/(tabs)/_layout.tsx`

- [ ] **Step 1: Update tab bar colors to teal**

Replace the `tabBarActiveTintColor` and add `backgroundColor` to `tabBarStyle`:

```tsx
import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: '#0d9488',
				tabBarInactiveTintColor: '#94a3b8',
				tabBarStyle: {
					backgroundColor: '#ffffff',
					borderTopColor: '#e2e8f0',
				},
			}}
		>
			<Tabs.Screen
				name="budget"
				options={{
					title: 'Budget',
					tabBarIcon: ({ color }) => (
						<Text style={{ color, fontSize: 20 }}>📊</Text>
					),
				}}
			/>
			<Tabs.Screen
				name="income"
				options={{
					title: 'Income',
					tabBarIcon: ({ color }) => (
						<Text style={{ color, fontSize: 20 }}>💰</Text>
					),
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					title: 'Settings',
					tabBarIcon: ({ color }) => (
						<Text style={{ color, fontSize: 20 }}>⚙️</Text>
					),
				}}
			/>
		</Tabs>
	);
}
```

- [ ] **Step 2: Visual check**

Open the app on device. The tab bar active item should now highlight in teal instead of blue.

- [ ] **Step 3: Commit**

```bash
git add src/app/(tabs)/_layout.tsx
git commit -m "style: teal tab bar active color"
```

---

## Task 2: Month Selector — White on Teal

**Files:**
- Modify: `src/pages/budget/ui/month-selector.tsx`

- [ ] **Step 1: Restyle for use inside teal banner**

The MonthSelector is rendered inside the teal section of BudgetPage. Update text colors to white:

```tsx
import { Pressable, Text, View } from 'react-native';

type Props = {
	label: string;
	onPrev: () => void;
	onNext: () => void;
};

export function MonthSelector({ label, onPrev, onNext }: Props) {
	return (
		<View className="flex-row items-center justify-between px-5 py-3">
			<Pressable onPress={onPrev} className="p-2">
				<Text className="text-white/80 text-xl">‹</Text>
			</Pressable>
			<Text className="text-lg font-bold text-white tracking-wide">{label}</Text>
			<Pressable onPress={onNext} className="p-2">
				<Text className="text-white/80 text-xl">›</Text>
			</Pressable>
		</View>
	);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/budget/ui/month-selector.tsx
git commit -m "style: month selector white text for teal banner"
```

---

## Task 3: Source Switcher — Teal Pill Style

**Files:**
- Modify: `src/pages/budget/ui/source-switcher.tsx`

- [ ] **Step 1: Update pill styling**

Active pill is teal-filled, inactive is white with slate border. This component will be rendered inside the teal banner area, so use white bg for inactive (not gray):

```tsx
import { Pressable, ScrollView, Text } from 'react-native';
import type { IncomeSource } from '@shared/lib';

type Props = {
	sources: IncomeSource[];
	selectedId: number | 'total' | null;
	onSelect: (id: number | 'total') => void;
};

export function SourceSwitcher({ sources, selectedId, onSelect }: Props) {
	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			className="px-4 mb-3"
			contentContainerStyle={{ gap: 8 }}
		>
			{sources.map((source) => (
				<Pressable
					key={source.id}
					className={`px-4 py-1.5 rounded-full ${
						selectedId === source.id ? 'bg-white' : 'bg-white/20'
					}`}
					onPress={() => onSelect(source.id)}
				>
					<Text
						className={`text-xs font-semibold ${
							selectedId === source.id ? 'text-teal-600' : 'text-white'
						}`}
					>
						{source.name}
					</Text>
				</Pressable>
			))}
			<Pressable
				className={`px-4 py-1.5 rounded-full ${
					selectedId === 'total' ? 'bg-white' : 'bg-white/20'
				}`}
				onPress={() => onSelect('total')}
			>
				<Text
					className={`text-xs font-semibold ${
						selectedId === 'total' ? 'text-teal-600' : 'text-white'
					}`}
				>
					Total
				</Text>
			</Pressable>
		</ScrollView>
	);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/budget/ui/source-switcher.tsx
git commit -m "style: source switcher teal pill style"
```

---

## Task 4: Summary Card — Hero Three-Column + Progress Bar

**Files:**
- Modify: `src/pages/budget/ui/summary-card.tsx`

- [ ] **Step 1: Rebuild as hero card for use inside teal banner**

The card renders on a teal background, so amounts are white. The remaining amount uses white always (readable on dark bg) — the red/teal distinction only matters in the white content area, which doesn't use SummaryCard:

```tsx
import { Text, View } from 'react-native';
import { formatCurrency } from '@shared/lib';

type Props = {
	income: number;
	allocated: number;
	currency: string;
};

export function SummaryCard({ income, allocated, currency }: Props) {
	const remaining = income - allocated;
	const allocatedPercent = income > 0 ? Math.min((allocated / income) * 100, 100) : 0;

	return (
		<View className="bg-white/15 rounded-2xl mx-4 p-4 mb-2">
			<View className="flex-row justify-between mb-3">
				<View>
					<Text className="text-[10px] text-white/65 uppercase tracking-widest mb-0.5">
						Income
					</Text>
					<Text className="text-xl font-extrabold text-white">
						{formatCurrency(income, currency)}
					</Text>
				</View>
				<View className="items-center">
					<Text className="text-[10px] text-white/65 uppercase tracking-widest mb-0.5">
						Allocated
					</Text>
					<Text className="text-xl font-extrabold text-white/85">
						{formatCurrency(allocated, currency)}
					</Text>
				</View>
				<View className="items-end">
					<Text className="text-[10px] text-white/65 uppercase tracking-widest mb-0.5">
						Remaining
					</Text>
					<Text className="text-xl font-extrabold text-white">
						{formatCurrency(remaining, currency)}
					</Text>
				</View>
			</View>
			{/* Progress bar */}
			<View className="bg-white/25 h-1.5 rounded-full mb-1">
				<View
					className="bg-white h-1.5 rounded-full"
					style={{ width: `${allocatedPercent}%` }}
				/>
			</View>
			<Text className="text-[10px] text-white/75">
				{Math.round(allocatedPercent)}% of income allocated
			</Text>
		</View>
	);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/budget/ui/summary-card.tsx
git commit -m "style: summary card hero three-column with progress bar"
```

---

## Task 5: Pay Period Toggle — Teal Pill Style

**Files:**
- Modify: `src/pages/budget/ui/pay-period-toggle.tsx`

- [ ] **Step 1: Update to pill style matching source switcher**

```tsx
import { Pressable, ScrollView, Text } from 'react-native';
import type { PayPeriod } from '@shared/lib';

type Props = {
	periods: PayPeriod[];
	selectedIndex: number | 'full';
	onSelect: (index: number | 'full') => void;
};

export function PayPeriodToggle({ periods, selectedIndex, onSelect }: Props) {
	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			className="px-4 mb-3"
			contentContainerStyle={{ gap: 8 }}
		>
			<Pressable
				className={`px-4 py-1.5 rounded-full ${
					selectedIndex === 'full'
						? 'bg-teal-600'
						: 'bg-white border border-slate-200'
				}`}
				onPress={() => onSelect('full')}
			>
				<Text
					className={`text-xs font-semibold ${
						selectedIndex === 'full' ? 'text-white' : 'text-slate-500'
					}`}
				>
					Full Month
				</Text>
			</Pressable>
			{periods.map((period) => (
				<Pressable
					key={period.index}
					className={`px-4 py-1.5 rounded-full ${
						selectedIndex === period.index
							? 'bg-teal-600'
							: 'bg-white border border-slate-200'
					}`}
					onPress={() => onSelect(period.index)}
				>
					<Text
						className={`text-xs font-semibold ${
							selectedIndex === period.index ? 'text-white' : 'text-slate-500'
						}`}
					>
						{period.label}
					</Text>
				</Pressable>
			))}
		</ScrollView>
	);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/budget/ui/pay-period-toggle.tsx
git commit -m "style: pay period toggle teal pill style"
```

---

## Task 6: Category Accordion — White Card + New Chevron

**Files:**
- Modify: `src/pages/budget/ui/category-accordion.tsx`

- [ ] **Step 1: Restyle as white card with typed amount color and `›`/`‹` chevron**

Add a `categoryName`-based color helper. "Expenses" gets red, all other categories get green. The chevron becomes a separate `›`/`‹` element far right:

```tsx
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { formatCurrency } from '@shared/lib';
import type { BudgetItemAllocation } from '@shared/lib';
import type { BudgetItemWithAllocations } from '../api/list-budget-items';
import { BudgetItemRow } from './budget-item-row';

type Props = {
	categoryName: string;
	items: BudgetItemWithAllocations[];
	selectedPeriodIndex: number | 'full';
	currency: string;
	onEditItem: (item: BudgetItemWithAllocations) => void;
	onTogglePaid: (allocationId: number) => void;
};

function getCategoryAmountColor(categoryName: string): string {
	return categoryName === 'Expenses' ? 'text-red-500' : 'text-green-600';
}

export function CategoryAccordion({
	categoryName,
	items,
	selectedPeriodIndex,
	currency,
	onEditItem,
	onTogglePaid,
}: Props) {
	const [expanded, setExpanded] = useState(true);

	const categoryTotal = items.reduce((sum, item) => {
		if (selectedPeriodIndex === 'full') return sum + item.total_amount;
		const alloc = item.allocations.find(
			(a: BudgetItemAllocation) => a.pay_period_index === selectedPeriodIndex,
		);
		return sum + (alloc?.amount ?? 0);
	}, 0);

	const getAllocation = (
		item: BudgetItemWithAllocations,
	): BudgetItemAllocation | null => {
		if (selectedPeriodIndex === 'full') return null;
		return (
			item.allocations.find(
				(a: BudgetItemAllocation) => a.pay_period_index === selectedPeriodIndex,
			) ?? null
		);
	};

	const getDisplayAmount = (item: BudgetItemWithAllocations): number => {
		if (selectedPeriodIndex === 'full') return item.total_amount;
		const alloc = getAllocation(item);
		return alloc?.amount ?? 0;
	};

	const amountColor = getCategoryAmountColor(categoryName);

	return (
		<View className="mx-4 mb-3 bg-white rounded-2xl shadow-sm overflow-hidden">
			<Pressable
				className="flex-row justify-between items-center px-4 py-3"
				onPress={() => setExpanded((prev) => !prev)}
			>
				<Text className="text-sm font-bold text-slate-900">{categoryName}</Text>
				<View className="flex-row items-center gap-2">
					<Text className={`text-sm font-bold ${amountColor}`}>
						{formatCurrency(categoryTotal, currency)}
					</Text>
					<Text className="text-slate-400 text-xs">
						{expanded ? '‹' : '›'}
					</Text>
				</View>
			</Pressable>
			{expanded && items.length > 0 && (
				<View className="border-t border-slate-100">
					{items.map((item) => (
						<BudgetItemRow
							key={item.id}
							name={item.name}
							amount={getDisplayAmount(item)}
							allocation={getAllocation(item)}
							currency={currency}
							onPress={() => onEditItem(item)}
							onTogglePaid={onTogglePaid}
							showCheckbox={selectedPeriodIndex !== 'full'}
						/>
					))}
				</View>
			)}
		</View>
	);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/budget/ui/category-accordion.tsx
git commit -m "style: category accordion white card with typed amount color"
```

---

## Task 7: Budget Item Row — Refined Text Styles

**Files:**
- Modify: `src/pages/budget/ui/budget-item-row.tsx`

- [ ] **Step 1: Update text sizes and colors to match new design**

```tsx
import { Pressable, Text, View } from 'react-native';
import { formatCurrency } from '@shared/lib';
import type { BudgetItemAllocation } from '@shared/lib';

type Props = {
	name: string;
	amount: number;
	allocation: BudgetItemAllocation | null;
	currency: string;
	onPress: () => void;
	onTogglePaid: (allocationId: number) => void;
	showCheckbox: boolean;
};

export function BudgetItemRow({
	name,
	amount,
	allocation,
	currency,
	onPress,
	onTogglePaid,
	showCheckbox,
}: Props) {
	const isPaid = allocation?.is_paid === 1;

	return (
		<Pressable className="flex-row items-center px-4 py-2.5" onPress={onPress}>
			{showCheckbox && allocation && (
				<Pressable className="mr-3" onPress={() => onTogglePaid(allocation.id)}>
					<Text className="text-lg text-slate-400">{isPaid ? '☑' : '☐'}</Text>
				</Pressable>
			)}
			<Text
				className={`flex-1 text-xs ${isPaid ? 'text-slate-400 line-through' : 'text-slate-700'}`}
			>
				{name}
			</Text>
			<Text
				className={`text-xs font-semibold ${isPaid ? 'text-slate-400' : 'text-slate-700'}`}
			>
				{formatCurrency(amount, currency)}
			</Text>
		</Pressable>
	);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/budget/ui/budget-item-row.tsx
git commit -m "style: budget item row refined slate text"
```

---

## Task 8: Budget Page — Teal Banner Layout Restructure

**Files:**
- Modify: `src/pages/budget/ui/budget-page.tsx`

This is the centerpiece change. The outer `View` becomes `bg-teal-600`. A `SafeAreaView` from `react-native-safe-area-context` (edges `['top']`) wraps the teal header content. The white content slides up over the teal via `-mt-4 rounded-t-3xl`.

The `SourceSwitcher` moves from the white area into the teal banner. The `SummaryCard` renders inside the teal banner. The `PayPeriodToggle` and category list stay in the white area.

- [ ] **Step 1: Rewrite budget-page.tsx**

```tsx
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Category, IncomeSource, PayPeriod } from '@shared/lib';
import type { useCreateBudgetItem } from '../model/hooks/use-create-budget-item';
import type { useDeleteBudgetItem } from '../model/hooks/use-delete-budget-item';
import type { useUpdateBudgetItem } from '../model/hooks/use-update-budget-item';
import type { BudgetItemWithAllocations } from '../api/list-budget-items';
import { BudgetItemModal } from './budget-item-modal';
import { CategoryAccordion } from './category-accordion';
import { MonthSelector } from './month-selector';
import { PayPeriodToggle } from './pay-period-toggle';
import { SourceSwitcher } from './source-switcher';
import { SummaryCard } from './summary-card';

type Props = {
	month: { label: string; onPrev: () => void; onNext: () => void };
	sourceSwitcher: {
		sources: IncomeSource[];
		selectedSourceId: number | 'total' | null;
		showSwitcher: boolean;
		onSelect: (id: number | 'total') => void;
		selectedSource: IncomeSource | null;
	};
	payPeriod: {
		periods: PayPeriod[];
		selectedIndex: number | 'full';
		onSelect: (index: number | 'full') => void;
	};
	summary: { income: number; allocated: number; currency: string };
	itemsByCategory: {
		categoryName: string;
		items: BudgetItemWithAllocations[];
	}[];
	categories: Category[];
	create: ReturnType<typeof useCreateBudgetItem>;
	update: ReturnType<typeof useUpdateBudgetItem>;
	remove: ReturnType<typeof useDeleteBudgetItem>;
	onTogglePaid: (allocationId: number) => void;
};

export function BudgetPage({
	month,
	sourceSwitcher,
	payPeriod,
	summary,
	itemsByCategory,
	categories,
	create,
	update,
	remove,
	onTogglePaid,
}: Props) {
	const modalVisible = create.showModal || !!update.editingItem;
	const isTotal = sourceSwitcher.selectedSourceId === 'total';

	return (
		<View className="flex-1 bg-teal-600">
			{/* Teal banner */}
			<SafeAreaView edges={['top']} className="bg-teal-600">
				<MonthSelector
					label={month.label}
					onPrev={month.onPrev}
					onNext={month.onNext}
				/>

				{sourceSwitcher.showSwitcher && (
					<SourceSwitcher
						sources={sourceSwitcher.sources}
						selectedId={sourceSwitcher.selectedSourceId}
						onSelect={sourceSwitcher.onSelect}
					/>
				)}

				<SummaryCard
					income={summary.income}
					allocated={summary.allocated}
					currency={summary.currency}
				/>
			</SafeAreaView>

			{/* White content slides up over teal */}
			<View className="flex-1 bg-slate-100 rounded-t-3xl -mt-4 overflow-hidden">
				<ScrollView
					className="flex-1"
					contentContainerStyle={{ paddingTop: 16, paddingBottom: 80 }}
				>
					{!isTotal && (
						<PayPeriodToggle
							periods={payPeriod.periods}
							selectedIndex={payPeriod.selectedIndex}
							onSelect={payPeriod.onSelect}
						/>
					)}

					{itemsByCategory.map((group) => (
						<CategoryAccordion
							key={group.categoryName}
							categoryName={group.categoryName}
							items={group.items}
							selectedPeriodIndex={isTotal ? 'full' : payPeriod.selectedIndex}
							currency={summary.currency}
							onEditItem={update.onEdit}
							onTogglePaid={onTogglePaid}
						/>
					))}

					{itemsByCategory.length === 0 && (
						<Text className="text-slate-400 text-sm text-center mt-16">
							No budget items yet.{'\n'}Tap + to add one.
						</Text>
					)}
				</ScrollView>

				{!isTotal && (
					<Pressable
						className="absolute bottom-6 right-6 bg-teal-600 w-12 h-12 rounded-full items-center justify-center shadow-lg"
						style={{ shadowColor: '#0d9488' }}
						onPress={create.onShow}
					>
						<Text className="text-white text-2xl">+</Text>
					</Pressable>
				)}
			</View>

			<BudgetItemModal
				visible={modalVisible}
				editingItem={update.editingItem}
				categories={categories}
				onSubmit={update.editingItem ? update.onSubmit : create.onSubmit}
				onDelete={update.editingItem ? remove.onDelete : undefined}
				onClose={update.editingItem ? update.onCancel : create.onHide}
				isPending={create.isPending || update.isPending}
			/>
		</View>
	);
}
```

- [ ] **Step 2: Visual check**

Open Budget tab. Should see: teal top area with month nav + source switcher pills + hero card with three columns and progress bar. Below it, white/slate area with pay period pills and category cards. Teal FAB bottom-right.

- [ ] **Step 3: Commit**

```bash
git add src/pages/budget/ui/budget-page.tsx
git commit -m "style: budget page teal banner + white slide-up layout"
```

---

## Task 9: Budget Item Modal — Teal Styling

**Files:**
- Modify: `src/pages/budget/ui/budget-item-modal.tsx`

- [ ] **Step 1: Update all blue references to teal, style inputs**

```tsx
import { useEffect, useState } from 'react';
import {
	Modal,
	Pressable,
	ScrollView,
	Text,
	TextInput,
	View,
} from 'react-native';
import type { Category, SplitType } from '@shared/lib';
import type { BudgetItemWithAllocations } from '../api/list-budget-items';

type Props = {
	visible: boolean;
	editingItem: BudgetItemWithAllocations | null;
	categories: Category[];
	onSubmit: (input: {
		categoryId: number;
		name: string;
		totalAmount: number;
		splitType: SplitType;
	}) => void;
	onDelete?: (id: number) => void;
	onClose: () => void;
	isPending: boolean;
};

export function BudgetItemModal({
	visible,
	editingItem,
	categories,
	onSubmit,
	onDelete,
	onClose,
	isPending,
}: Props) {
	const [name, setName] = useState('');
	const [amount, setAmount] = useState('');
	const [categoryId, setCategoryId] = useState<number | null>(null);
	const [focusedField, setFocusedField] = useState<string | null>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: visible is a prop that triggers form reset when the modal opens
	useEffect(() => {
		if (editingItem) {
			setName(editingItem.name);
			setAmount(String(editingItem.total_amount));
			setCategoryId(editingItem.category_id);
		} else {
			setName('');
			setAmount('');
			setCategoryId(categories[0]?.id ?? null);
		}
	}, [editingItem, visible, categories]);

	const isValid =
		name.trim() !== '' && Number(amount) > 0 && categoryId !== null;

	return (
		<Modal
			visible={visible}
			animationType="slide"
			presentationStyle="pageSheet"
		>
			<ScrollView className="flex-1 bg-white pt-6 px-6">
				<View className="flex-row justify-between items-center mb-6">
					<Text className="text-xl font-bold text-slate-900">
						{editingItem ? 'Edit Item' : 'Add Item'}
					</Text>
					<Pressable onPress={onClose}>
						<Text className="text-slate-400 text-lg">✕</Text>
					</Pressable>
				</View>

				<Text className="text-sm font-medium text-slate-700 mb-1">Name</Text>
				<TextInput
					className={`bg-slate-50 rounded-xl px-4 py-3 text-base text-slate-900 mb-4 border ${focusedField === 'name' ? 'border-teal-600' : 'border-slate-200'}`}
					placeholder="e.g., Rent"
					placeholderTextColor="#94a3b8"
					value={name}
					onChangeText={setName}
					onFocus={() => setFocusedField('name')}
					onBlur={() => setFocusedField(null)}
				/>

				<Text className="text-sm font-medium text-slate-700 mb-1">
					Amount (monthly total)
				</Text>
				<TextInput
					className={`bg-slate-50 rounded-xl px-4 py-3 text-base text-slate-900 mb-4 border ${focusedField === 'amount' ? 'border-teal-600' : 'border-slate-200'}`}
					placeholder="e.g., 6800"
					placeholderTextColor="#94a3b8"
					value={amount}
					onChangeText={setAmount}
					keyboardType="numeric"
					onFocus={() => setFocusedField('amount')}
					onBlur={() => setFocusedField(null)}
				/>

				<Text className="text-sm font-medium text-slate-700 mb-2">Category</Text>
				<View className="flex-row flex-wrap gap-2 mb-6">
					{categories.map((cat) => (
						<Pressable
							key={cat.id}
							className={`px-4 py-2 rounded-full ${
								categoryId === cat.id ? 'bg-teal-600' : 'bg-slate-100'
							}`}
							onPress={() => setCategoryId(cat.id)}
						>
							<Text
								className={`text-sm ${
									categoryId === cat.id
										? 'text-white font-semibold'
										: 'text-slate-600'
								}`}
							>
								{cat.name}
							</Text>
						</Pressable>
					))}
				</View>

				<Pressable
					className={`rounded-xl px-8 py-4 items-center mb-3 ${
						isValid && !isPending ? 'bg-teal-600' : 'bg-slate-200'
					}`}
					onPress={() =>
						isValid &&
						onSubmit({
							categoryId: categoryId!,
							name: name.trim(),
							totalAmount: Number(amount),
							splitType: 'even',
						})
					}
					disabled={!isValid || isPending}
				>
					<Text className={`text-base font-bold ${isValid && !isPending ? 'text-white' : 'text-slate-400'}`}>
						{isPending
							? 'Saving...'
							: editingItem
								? 'Save Changes'
								: 'Add Item'}
					</Text>
				</Pressable>

				{editingItem && onDelete && (
					<Pressable
						className="items-center py-3 mb-12"
						onPress={() => onDelete(editingItem.id)}
					>
						<Text className="text-red-500 text-sm font-semibold">
							Delete Item
						</Text>
					</Pressable>
				)}
			</ScrollView>
		</Modal>
	);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/budget/ui/budget-item-modal.tsx
git commit -m "style: budget item modal teal buttons and styled inputs"
```

---

## Task 10: Income Page — Teal Banner Layout

**Files:**
- Modify: `src/pages/income/ui/income-page.tsx`
- Modify: `src/pages/income/ui/income-source-card.tsx`

- [ ] **Step 1: Rewrite income-page.tsx with teal banner**

The total income is computed as the sum of all sources — a presentational calculation only:

```tsx
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { IncomeSource } from '@shared/lib';
import { formatCurrency } from '@shared/lib';
import type { useCreateIncomeSource } from '../model/hooks/use-create-income-source';
import type { useDeleteIncomeSource } from '../model/hooks/use-delete-income-source';
import type { useUpdateIncomeSource } from '../model/hooks/use-update-income-source';
import { IncomeSourceCard } from './income-source-card';
import { IncomeSourceModal } from './income-source-modal';

type Props = {
	sources: IncomeSource[];
	isLoading: boolean;
	currency: string;
	create: ReturnType<typeof useCreateIncomeSource>;
	update: ReturnType<typeof useUpdateIncomeSource>;
	remove: ReturnType<typeof useDeleteIncomeSource>;
};

export function IncomePage({
	sources,
	isLoading,
	currency,
	create,
	update,
	remove,
}: Props) {
	const modalVisible = create.showModal || !!update.editingSource;
	const totalIncome = sources.reduce((sum, s) => sum + s.amount, 0);

	return (
		<View className="flex-1 bg-teal-600">
			{/* Teal banner */}
			<SafeAreaView edges={['top']} className="bg-teal-600">
				<View className="flex-row justify-between items-center px-5 py-4">
					<Text className="text-xl font-bold text-white">Income Sources</Text>
					{sources.length > 0 && (
						<Text className="text-sm text-white/80">
							{formatCurrency(totalIncome, currency)}
						</Text>
					)}
				</View>
			</SafeAreaView>

			{/* White content slides up over teal */}
			<View className="flex-1 bg-slate-100 rounded-t-3xl -mt-4 overflow-hidden">
				<FlatList
					data={sources}
					keyExtractor={(item) => String(item.id)}
					contentContainerStyle={{ paddingTop: 16, paddingBottom: 80 }}
					renderItem={({ item }) => (
						<IncomeSourceCard
							source={item}
							currency={currency}
							onEdit={update.onEdit}
							onDelete={remove.onDelete}
						/>
					)}
					ListEmptyComponent={
						<Text className="text-slate-400 text-sm text-center mt-16">
							No income sources yet.{'\n'}Tap + to add one.
						</Text>
					}
				/>

				<Pressable
					className="absolute bottom-6 right-6 bg-teal-600 w-12 h-12 rounded-full items-center justify-center shadow-lg"
					style={{ shadowColor: '#0d9488' }}
					onPress={create.onShow}
				>
					<Text className="text-white text-2xl">+</Text>
				</Pressable>
			</View>

			<IncomeSourceModal
				visible={modalVisible}
				editingSource={update.editingSource}
				onSubmit={update.editingSource ? update.onSubmit : create.onSubmit}
				onClose={update.editingSource ? update.onCancel : create.onHide}
				isPending={create.isPending || update.isPending}
			/>
		</View>
	);
}
```

- [ ] **Step 2: Restyle income-source-card.tsx**

```tsx
import { Pressable, Text, View } from 'react-native';
import type { IncomeSource } from '@shared/lib';
import { formatCurrency } from '@shared/lib';

type Props = {
	source: IncomeSource;
	currency: string;
	onEdit: (source: IncomeSource) => void;
	onDelete: (id: number) => void;
};

const scheduleLabels: Record<string, string> = {
	monthly: 'Monthly',
	'bi-monthly': 'Twice a month',
	'bi-weekly': 'Every 2 weeks',
	weekly: 'Every week',
};

export function IncomeSourceCard({
	source,
	currency,
	onEdit,
	onDelete,
}: Props) {
	return (
		<Pressable
			className="bg-white rounded-2xl shadow-sm mx-4 mb-3 px-4 py-3"
			onPress={() => onEdit(source)}
			onLongPress={() => onDelete(source.id)}
		>
			<View className="flex-row justify-between items-start">
				<View className="flex-1 mr-3">
					<Text className="text-sm font-bold text-slate-900 mb-1">
						{source.name}
					</Text>
					<Text className="text-xs text-slate-500">
						{scheduleLabels[source.pay_schedule]}
					</Text>
				</View>
				<Text className="text-base font-bold text-green-600">
					{formatCurrency(source.amount, currency)}
				</Text>
			</View>
		</Pressable>
	);
}
```

- [ ] **Step 3: Visual check**

Open Income tab. Should see teal banner with "Income Sources" and total on the right. White area below with cards per source.

- [ ] **Step 4: Commit**

```bash
git add src/pages/income/ui/income-page.tsx src/pages/income/ui/income-source-card.tsx
git commit -m "style: income page teal banner + white card layout"
```

---

## Task 11: Income Source Modal — Teal Styling

**Files:**
- Modify: `src/pages/income/ui/income-source-modal.tsx`

- [ ] **Step 1: Read the current file**

Read `src/pages/income/ui/income-source-modal.tsx` to see all the form fields (pay schedule logic varies).

- [ ] **Step 2: Apply teal styling throughout**

Apply the same modal pattern as BudgetItemModal:
- Title: `text-xl font-bold text-slate-900`, close button: `text-slate-400 text-lg` with `✕`
- Add `const [focusedField, setFocusedField] = useState<string | null>(null)` state
- All `TextInput`: `bg-slate-50 rounded-xl px-4 py-3 text-slate-900 border` + `border-teal-600` when that field is focused, `border-slate-200` otherwise. Use `onFocus={() => setFocusedField('fieldName')}` and `onBlur={() => setFocusedField(null)}` on every input
- All segment/picker pill buttons: active `bg-teal-600 text-white`, inactive `bg-slate-100 text-slate-600` with `rounded-full`
- Primary submit button: `bg-teal-600 rounded-xl py-4 text-white font-bold` when valid, `bg-slate-200 text-slate-400` when disabled
- Delete button: `text-red-500 text-sm font-semibold text-center`
- Replace all `text-blue-600` / `bg-blue-600` / `border-blue-*` / `bg-blue-50` with teal equivalents
- `placeholderTextColor="#94a3b8"` on all TextInput elements

- [ ] **Step 3: Commit**

```bash
git add src/pages/income/ui/income-source-modal.tsx
git commit -m "style: income source modal teal styling"
```

---

## Task 12: Settings Page — Teal Banner + Grouped Sections

**Files:**
- Modify: `src/pages/settings/ui/settings-page.tsx`
- Modify: `src/pages/settings/ui/category-list.tsx`
- Modify: `src/pages/settings/ui/currency-picker.tsx`
- Modify: `src/pages/settings/ui/category-modal.tsx`

- [ ] **Step 1: Rewrite settings-page.tsx with teal banner + grouped sections**

```tsx
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { currencies } from '@shared/config';
import type { Category, UserPreferences } from '@shared/lib';
import type { useCreateCategory } from '../model/hooks/use-create-category';
import type { useDeleteCategory } from '../model/hooks/use-delete-category';
import type { useUpdateCategory } from '../model/hooks/use-update-category';
import { CategoryList } from './category-list';
import { CategoryModal } from './category-modal';
import { CurrencyPicker } from './currency-picker';

type Props = {
	preferences: UserPreferences | null;
	categories: Category[];
	currencyPicker: {
		visible: boolean;
		onShow: () => void;
		onHide: () => void;
		onUpdate: (currency: string) => void;
	};
	createCategory: ReturnType<typeof useCreateCategory>;
	updateCategory: ReturnType<typeof useUpdateCategory>;
	deleteCategory: ReturnType<typeof useDeleteCategory>;
};

export function SettingsPage({
	preferences,
	categories,
	currencyPicker,
	createCategory,
	updateCategory,
	deleteCategory,
}: Props) {
	const currencyInfo = currencies.find((c) => c.code === preferences?.currency);

	const categoryModalVisible =
		createCategory.showModal || !!updateCategory.editingCategory;

	return (
		<View className="flex-1 bg-teal-600">
			{/* Teal banner */}
			<SafeAreaView edges={['top']} className="bg-teal-600">
				<View className="px-5 py-4">
					<Text className="text-xl font-bold text-white">Settings</Text>
				</View>
			</SafeAreaView>

			{/* White content slides up over teal */}
			<View className="flex-1 bg-slate-100 rounded-t-3xl -mt-4 overflow-hidden">
				<ScrollView
					className="flex-1"
					contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}
				>
					{/* Currency section label */}
					<Text className="text-xs font-bold tracking-widest text-slate-400 uppercase mx-4 mt-4 mb-1.5">
						Currency
					</Text>
					<CategoryList
						categories={categories}
						currencyInfo={currencyInfo}
						onEdit={updateCategory.onEdit}
						onDelete={deleteCategory.onDelete}
						onAdd={createCategory.onShow}
						onCurrencyPress={currencyPicker.onShow}
					/>

					<View className="mt-6 mb-4">
						<Text className="text-xs text-slate-300 text-center">
							SaveNa v1.0.0
						</Text>
					</View>
				</ScrollView>
			</View>

			<CurrencyPicker
				visible={currencyPicker.visible}
				selectedCurrency={preferences?.currency ?? 'PHP'}
				onSelect={currencyPicker.onUpdate}
				onClose={currencyPicker.onHide}
			/>

			<CategoryModal
				visible={categoryModalVisible}
				editingCategory={updateCategory.editingCategory}
				onSubmit={
					updateCategory.editingCategory
						? updateCategory.onSubmit
						: createCategory.onSubmit
				}
				onClose={
					updateCategory.editingCategory
						? updateCategory.onCancel
						: createCategory.onHide
				}
				isPending={createCategory.isPending || updateCategory.isPending}
			/>
		</View>
	);
}
```

> **Note:** `CategoryList` is getting new props (`currencyInfo`, `onCurrencyPress`) to render both the currency row and categories in one component. This keeps `SettingsPage` clean.

- [ ] **Step 2: Rewrite category-list.tsx with currency row + grouped card + Add Category card**

```tsx
import { Pressable, Text, View } from 'react-native';
import type { Category } from '@shared/lib';

type CurrencyInfo = { symbol: string; code: string } | undefined;

type Props = {
	categories: Category[];
	currencyInfo: CurrencyInfo;
	onEdit: (category: Category) => void;
	onDelete: (id: number) => void;
	onAdd: () => void;
	onCurrencyPress: () => void;
};

export function CategoryList({
	categories,
	currencyInfo,
	onEdit,
	onDelete,
	onAdd,
	onCurrencyPress,
}: Props) {
	return (
		<View>
			{/* Currency row */}
			<Pressable
				className="bg-white rounded-2xl shadow-sm mx-4 mb-4 px-4 py-3 flex-row justify-between items-center"
				onPress={onCurrencyPress}
			>
				<Text className="text-sm text-slate-900">Currency</Text>
				<View className="flex-row items-center gap-1">
					<Text className="text-sm font-semibold text-teal-600">
						{currencyInfo
							? `${currencyInfo.symbol} ${currencyInfo.code}`
							: '—'}
					</Text>
					<Text className="text-slate-400 text-xs">›</Text>
				</View>
			</Pressable>

			{/* Categories section label */}
			<Text className="text-xs font-bold tracking-widest text-slate-400 uppercase mx-4 mt-4 mb-1.5">
				Categories
			</Text>

			{/* Categories grouped card */}
			{categories.length > 0 && (
				<View className="bg-white rounded-2xl shadow-sm mx-4 mb-3 overflow-hidden">
					{categories.map((cat, index) => (
						<Pressable
							key={cat.id}
							className={`flex-row justify-between items-center px-4 py-3 ${
								index < categories.length - 1 ? 'border-b border-slate-100' : ''
							}`}
							onPress={() => onEdit(cat)}
							onLongPress={() => onDelete(cat.id)}
						>
							<Text className="text-sm text-slate-900">{cat.name}</Text>
							<Text className="text-slate-400 text-xs">›</Text>
						</Pressable>
					))}
				</View>
			)}

			{/* Add Category card */}
			<Pressable
				className="bg-white rounded-2xl shadow-sm mx-4 mb-3 px-4 py-3 flex-row items-center gap-3"
				onPress={onAdd}
			>
				<View className="bg-teal-50 w-6 h-6 rounded-full items-center justify-center">
					<Text className="text-teal-600 text-base font-bold leading-none">+</Text>
				</View>
				<Text className="text-sm font-semibold text-teal-600">Add Category</Text>
			</Pressable>
		</View>
	);
}
```

- [ ] **Step 3: Restyle currency-picker.tsx with teal selection**

```tsx
import { FlatList, Modal, Pressable, Text, View } from 'react-native';
import { currencies } from '@shared/config';

type Props = {
	visible: boolean;
	selectedCurrency: string;
	onSelect: (code: string) => void;
	onClose: () => void;
};

export function CurrencyPicker({
	visible,
	selectedCurrency,
	onSelect,
	onClose,
}: Props) {
	return (
		<Modal
			visible={visible}
			animationType="slide"
			presentationStyle="pageSheet"
		>
			<View className="flex-1 bg-white pt-6 px-6">
				<View className="flex-row justify-between items-center mb-6">
					<Text className="text-xl font-bold text-slate-900">Currency</Text>
					<Pressable onPress={onClose}>
						<Text className="text-slate-400 text-lg">✕</Text>
					</Pressable>
				</View>
				<FlatList
					data={currencies}
					keyExtractor={(item) => item.code}
					renderItem={({ item }) => {
						const isSelected = selectedCurrency === item.code;
						return (
							<Pressable
								className={`flex-row items-center px-4 py-3 rounded-xl mb-2 ${
									isSelected ? 'bg-teal-50' : 'bg-slate-50'
								}`}
								onPress={() => {
									onSelect(item.code);
									onClose();
								}}
							>
								<Text className="text-base text-slate-900 flex-1">
									{item.symbol} {item.name}
								</Text>
								<Text
									className={`text-sm font-semibold mr-2 ${
										isSelected ? 'text-teal-600' : 'text-slate-400'
									}`}
								>
									{item.code}
								</Text>
								{isSelected && (
									<Text className="text-teal-600 font-bold">✓</Text>
								)}
							</Pressable>
						);
					}}
				/>
			</View>
		</Modal>
	);
}
```

- [ ] **Step 4: Restyle category-modal.tsx**

```tsx
import { useEffect, useState } from 'react';
import { Modal, Pressable, Text, TextInput, View } from 'react-native';
import type { Category } from '@shared/lib';

type Props = {
	visible: boolean;
	editingCategory: Category | null;
	onSubmit: (name: string) => void;
	onClose: () => void;
	isPending: boolean;
};

export function CategoryModal({
	visible,
	editingCategory,
	onSubmit,
	onClose,
	isPending,
}: Props) {
	const [name, setName] = useState('');
	const [nameFocused, setNameFocused] = useState(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: visible is a prop that triggers form reset when the modal opens
	useEffect(() => {
		setName(editingCategory?.name ?? '');
	}, [editingCategory, visible]);

	const isValid = name.trim() !== '';

	return (
		<Modal
			visible={visible}
			animationType="slide"
			presentationStyle="pageSheet"
		>
			<View className="flex-1 bg-white pt-6 px-6">
				<View className="flex-row justify-between items-center mb-6">
					<Text className="text-xl font-bold text-slate-900">
						{editingCategory ? 'Rename Category' : 'Add Category'}
					</Text>
					<Pressable onPress={onClose}>
						<Text className="text-slate-400 text-lg">✕</Text>
					</Pressable>
				</View>

				<Text className="text-sm font-medium text-slate-700 mb-1">Name</Text>
				<TextInput
					className={`bg-slate-50 rounded-xl px-4 py-3 text-base text-slate-900 mb-6 border ${nameFocused ? 'border-teal-600' : 'border-slate-200'}`}
					placeholder="e.g., Debt Repayment"
					placeholderTextColor="#94a3b8"
					value={name}
					onChangeText={setName}
					onFocus={() => setNameFocused(true)}
					onBlur={() => setNameFocused(false)}
					autoFocus
				/>

				<Pressable
					className={`rounded-xl px-8 py-4 items-center ${
						isValid && !isPending ? 'bg-teal-600' : 'bg-slate-200'
					}`}
					onPress={() => isValid && onSubmit(name.trim())}
					disabled={!isValid || isPending}
				>
					<Text className={`text-base font-bold ${isValid && !isPending ? 'text-white' : 'text-slate-400'}`}>
						{isPending ? 'Saving...' : 'Save'}
					</Text>
				</Pressable>
			</View>
		</Modal>
	);
}
```

- [ ] **Step 5: Visual check**

Open Settings tab. Should see: teal banner with "Settings". White area with Currency row (teal value + chevron), Categories section header, grouped card with all categories (chevron each row), separate Add Category card with teal + icon.

- [ ] **Step 6: Commit**

```bash
git add src/pages/settings/ui/settings-page.tsx src/pages/settings/ui/category-list.tsx src/pages/settings/ui/currency-picker.tsx src/pages/settings/ui/category-modal.tsx
git commit -m "style: settings page teal banner + iOS-style grouped sections"
```

---

## Task 13: Welcome Page — Teal Accent

**Files:**
- Modify: `src/pages/onboarding/ui/welcome-page.tsx`

- [ ] **Step 1: Update to teal accent + pill button**

```tsx
import { Pressable, Text, View } from 'react-native';

type Props = {
	onNext: () => void;
};

export function WelcomePage({ onNext }: Props) {
	return (
		<View className="flex-1 items-center justify-center bg-white px-8">
			<Text className="text-4xl font-extrabold text-teal-600 mb-3">SaveNa</Text>
			<Text className="text-base text-slate-500 text-center mb-12">
				Budget your salary, split across paydays, track your progress.
			</Text>
			<Pressable
				className="bg-teal-600 rounded-full px-8 py-4 w-full items-center"
				onPress={onNext}
			>
				<Text className="text-white text-base font-bold">Get Started</Text>
			</Pressable>
		</View>
	);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/onboarding/ui/welcome-page.tsx
git commit -m "style: welcome page teal accent and pill button"
```

---

## Task 14: Onboarding Currency Page — Teal Selection

**Files:**
- Modify: `src/pages/onboarding/ui/currency-page.tsx`

- [ ] **Step 1: Replace blue highlight with teal checkmark, teal Next button**

```tsx
import { FlatList, Pressable, Text, View } from 'react-native';
import { currencies } from '@shared/config';

type Props = {
	selectedCurrency: string;
	onSelect: (code: string) => void;
	onNext: () => void;
};

export function CurrencyPage({ selectedCurrency, onSelect, onNext }: Props) {
	return (
		<View className="flex-1 bg-white pt-16 px-6">
			<Text className="text-2xl font-bold text-slate-900 mb-2">
				Choose your currency
			</Text>
			<Text className="text-slate-500 mb-6">
				This is the currency you'll budget in.
			</Text>

			<FlatList
				data={currencies}
				keyExtractor={(item) => item.code}
				className="flex-1 mb-4"
				renderItem={({ item }) => {
					const isSelected = selectedCurrency === item.code;
					return (
						<Pressable
							className={`flex-row items-center px-4 py-3 rounded-xl mb-2 ${
								isSelected ? 'bg-teal-50' : 'bg-slate-50'
							}`}
							onPress={() => onSelect(item.code)}
						>
							<Text className="text-base text-slate-900 flex-1">
								{item.symbol} {item.name}
							</Text>
							<Text
								className={`text-sm font-semibold mr-2 ${
									isSelected ? 'text-teal-600' : 'text-slate-400'
								}`}
							>
								{item.code}
							</Text>
							{isSelected && (
								<Text className="text-teal-600 font-bold">✓</Text>
							)}
						</Pressable>
					);
				}}
			/>

			<Pressable
				className="bg-teal-600 rounded-full px-8 py-4 items-center mb-8"
				onPress={onNext}
			>
				<Text className="text-white text-base font-bold">Next</Text>
			</Pressable>
		</View>
	);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/onboarding/ui/currency-page.tsx
git commit -m "style: onboarding currency page teal selection and button"
```

---

## Task 15: Onboarding Income Source Page — Teal Styling

**Files:**
- Modify: `src/pages/onboarding/ui/income-source-page.tsx`

- [ ] **Step 1: Apply teal pill selectors, styled inputs, teal submit button**

```tsx
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import type { PaySchedule } from '@shared/lib';

type Props = {
	onFinish: (income: {
		name: string;
		amount: number;
		paySchedule: PaySchedule;
		payDates: number[];
	}) => void;
	isPending: boolean;
};

const scheduleOptions: { value: PaySchedule; label: string }[] = [
	{ value: 'monthly', label: 'Monthly' },
	{ value: 'bi-monthly', label: 'Twice a month' },
	{ value: 'bi-weekly', label: 'Every 2 weeks' },
	{ value: 'weekly', label: 'Every week' },
];

const dayOfWeekOptions = [
	{ value: 0, label: 'Sunday' },
	{ value: 1, label: 'Monday' },
	{ value: 2, label: 'Tuesday' },
	{ value: 3, label: 'Wednesday' },
	{ value: 4, label: 'Thursday' },
	{ value: 5, label: 'Friday' },
	{ value: 6, label: 'Saturday' },
];

export function IncomeSourcePage({ onFinish, isPending }: Props) {
	const [name, setName] = useState('');
	const [amount, setAmount] = useState('');
	const [paySchedule, setPaySchedule] = useState<PaySchedule>('bi-monthly');
	const [firstPayDay, setFirstPayDay] = useState('15');
	const [secondPayDay, setSecondPayDay] = useState('30');
	const [dayOfWeek, setDayOfWeek] = useState(5); // Friday
	const [focusedField, setFocusedField] = useState<string | null>(null);

	const getPayDates = (): number[] => {
		switch (paySchedule) {
			case 'monthly':
				return [Number(firstPayDay)];
			case 'bi-monthly':
				return [Number(firstPayDay), Number(secondPayDay)];
			case 'weekly':
			case 'bi-weekly':
				return [dayOfWeek];
		}
	};

	const isValid = name.trim() !== '' && Number(amount) > 0;

	const handleFinish = () => {
		if (!isValid) return;
		onFinish({
			name: name.trim(),
			amount: Number(amount),
			paySchedule,
			payDates: getPayDates(),
		});
	};

	return (
		<ScrollView className="flex-1 bg-white pt-16 px-6">
			<Text className="text-2xl font-bold text-slate-900 mb-2">
				Add your income
			</Text>
			<Text className="text-slate-500 mb-6">
				Tell us about your primary income source.
			</Text>

			<Text className="text-sm font-medium text-slate-700 mb-1">Name</Text>
			<TextInput
				className={`bg-slate-50 rounded-xl px-4 py-3 text-base text-slate-900 mb-4 border ${focusedField === 'name' ? 'border-teal-600' : 'border-slate-200'}`}
				placeholder="e.g., Main Job"
				placeholderTextColor="#94a3b8"
				value={name}
				onChangeText={setName}
				onFocus={() => setFocusedField('name')}
				onBlur={() => setFocusedField(null)}
			/>

			<Text className="text-sm font-medium text-slate-700 mb-1">Net Salary</Text>
			<TextInput
				className={`bg-slate-50 rounded-xl px-4 py-3 text-base text-slate-900 mb-4 border ${focusedField === 'amount' ? 'border-teal-600' : 'border-slate-200'}`}
				placeholder="e.g., 53392"
				placeholderTextColor="#94a3b8"
				value={amount}
				onChangeText={setAmount}
				keyboardType="numeric"
				onFocus={() => setFocusedField('amount')}
				onBlur={() => setFocusedField(null)}
			/>

			<Text className="text-sm font-medium text-slate-700 mb-2">
				Pay Schedule
			</Text>
			<View className="flex-row flex-wrap gap-2 mb-4">
				{scheduleOptions.map((opt) => (
					<Pressable
						key={opt.value}
						className={`px-4 py-2 rounded-full ${
							paySchedule === opt.value ? 'bg-teal-600' : 'bg-slate-100'
						}`}
						onPress={() => setPaySchedule(opt.value)}
					>
						<Text
							className={`text-sm ${
								paySchedule === opt.value
									? 'text-white font-semibold'
									: 'text-slate-600'
							}`}
						>
							{opt.label}
						</Text>
					</Pressable>
				))}
			</View>

			{(paySchedule === 'monthly' || paySchedule === 'bi-monthly') && (
				<View className="mb-4">
					<Text className="text-sm font-medium text-slate-700 mb-1">
						{paySchedule === 'monthly' ? 'Pay day' : 'First pay day'}
					</Text>
					<TextInput
						className={`bg-slate-50 rounded-xl px-4 py-3 text-base text-slate-900 mb-2 border ${focusedField === 'firstPayDay' ? 'border-teal-600' : 'border-slate-200'}`}
						placeholder="e.g., 15"
						placeholderTextColor="#94a3b8"
						value={firstPayDay}
						onChangeText={setFirstPayDay}
						keyboardType="numeric"
						onFocus={() => setFocusedField('firstPayDay')}
						onBlur={() => setFocusedField(null)}
					/>
					{paySchedule === 'bi-monthly' && (
						<>
							<Text className="text-sm font-medium text-slate-700 mb-1">
								Second pay day
							</Text>
							<TextInput
								className={`bg-slate-50 rounded-xl px-4 py-3 text-base text-slate-900 border ${focusedField === 'secondPayDay' ? 'border-teal-600' : 'border-slate-200'}`}
								placeholder="e.g., 30"
								placeholderTextColor="#94a3b8"
								value={secondPayDay}
								onChangeText={setSecondPayDay}
								keyboardType="numeric"
								onFocus={() => setFocusedField('secondPayDay')}
								onBlur={() => setFocusedField(null)}
							/>
						</>
					)}
				</View>
			)}

			{(paySchedule === 'weekly' || paySchedule === 'bi-weekly') && (
				<View className="mb-4">
					<Text className="text-sm font-medium text-slate-700 mb-2">
						Pay day
					</Text>
					<View className="flex-row flex-wrap gap-2">
						{dayOfWeekOptions.map((opt) => (
							<Pressable
								key={opt.value}
								className={`px-4 py-2 rounded-full ${
									dayOfWeek === opt.value ? 'bg-teal-600' : 'bg-slate-100'
								}`}
								onPress={() => setDayOfWeek(opt.value)}
							>
								<Text
									className={`text-sm ${
										dayOfWeek === opt.value
											? 'text-white font-semibold'
											: 'text-slate-600'
									}`}
								>
									{opt.label}
								</Text>
							</Pressable>
						))}
					</View>
				</View>
			)}

			<Pressable
				className={`rounded-xl px-8 py-4 items-center mb-12 ${
					isValid && !isPending ? 'bg-teal-600' : 'bg-slate-200'
				}`}
				onPress={handleFinish}
				disabled={!isValid || isPending}
			>
				<Text className={`text-base font-bold ${isValid && !isPending ? 'text-white' : 'text-slate-400'}`}>
					{isPending ? 'Setting up...' : 'Start Budgeting'}
				</Text>
			</Pressable>
		</ScrollView>
	);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/onboarding/ui/income-source-page.tsx
git commit -m "style: onboarding income source page teal styling"
```

---

## Final Visual Check

After all tasks are complete, navigate through the full app flow:

1. **Onboarding**: Welcome screen (teal app name, pill button)
2. **Budget tab**: Teal banner with month nav, source switcher pills, hero card with 3-column stats + progress bar. White area below with pay period pills, white category cards, teal FAB.
3. **Add budget item**: Modal with styled inputs, teal category pills, teal submit button.
4. **Income tab**: Teal banner with title + total. White area with income cards.
5. **Add income source**: Modal with teal styling.
6. **Settings tab**: Teal banner. Grouped sections with currency row and categories card.
7. **Rename / add category**: Modal with teal button.
8. **Currency picker**: Teal highlight on selected row with checkmark.
