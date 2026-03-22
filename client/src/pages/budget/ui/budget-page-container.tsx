import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { getPreferences, listCategories } from '@shared/db';
import type { Category } from '@shared/lib';
import {
	useBudgetItems,
	useBudgetMonth,
	useCreateBudgetItem,
	useDeleteBudgetItem,
	usePayPeriodToggle,
	useSourceSwitcher,
	useTogglePaid,
	useUpdateBudgetItem,
} from '../model/hooks';
import { BudgetPage } from './budget-page';

export function BudgetPageContainer() {
	const month = useBudgetMonth();
	const switcher = useSourceSwitcher();
	const payPeriod = usePayPeriodToggle(
		switcher.selectedSource,
		month.yearMonth,
	);
	const { items, budgetMonthId, refresh } = useBudgetItems(
		month.yearMonth,
		switcher.selectedSourceId,
	);
	const create = useCreateBudgetItem(
		budgetMonthId,
		switcher.selectedSource,
		month.yearMonth,
		refresh,
	);
	const update = useUpdateBudgetItem(
		switcher.selectedSource,
		month.yearMonth,
		refresh,
	);
	const remove = useDeleteBudgetItem(() => { refresh(); update.onCancel(); });
	const { onToggle } = useTogglePaid(refresh);

	const [currency, setCurrency] = useState('PHP');
	const [categories, setCategories] = useState<Category[]>([]);

	useFocusEffect(
		useCallback(() => {
			async function load() {
				const prefs = await getPreferences();
				if (prefs) setCurrency(prefs.currency);
				const cats = await listCategories();
				setCategories(cats);
			}
			load();
		}, []),
	);

	const itemsByCategory = useMemo(() => {
		const grouped = new Map<string, typeof items>();
		for (const item of items) {
			const existing = grouped.get(item.category_name) ?? [];
			existing.push(item);
			grouped.set(item.category_name, existing);
		}
		return Array.from(grouped.entries()).map(
			([categoryName, categoryItems]) => ({
				categoryName,
				items: categoryItems,
			}),
		);
	}, [items]);

	const isTotal = switcher.selectedSourceId === 'total';
	const periodIndex = payPeriod.selectedIndex;

	const totalIncome = useMemo(() => {
		if (isTotal) {
			return switcher.sources.reduce((sum, s) => sum + s.amount, 0);
		}
		const sourceAmount = switcher.selectedSource?.amount ?? 0;
		if (periodIndex === 'full') return sourceAmount;
		const periodCount = payPeriod.periods.length;
		return periodCount > 0 ? sourceAmount / periodCount : sourceAmount;
	}, [
		isTotal,
		switcher.selectedSource,
		switcher.sources,
		periodIndex,
		payPeriod.periods.length,
	]);

	const totalAllocated = useMemo(() => {
		if (periodIndex === 'full' || isTotal) {
			return items.reduce((sum, item) => sum + item.total_amount, 0);
		}
		return items.reduce((sum, item) => {
			const alloc = item.allocations.find(
				(a) => a.pay_period_index === periodIndex,
			);
			return sum + (alloc?.amount ?? 0);
		}, 0);
	}, [items, periodIndex, isTotal]);

	return (
		<BudgetPage
			month={{ label: month.label, onPrev: month.onPrev, onNext: month.onNext }}
			sourceSwitcher={switcher}
			payPeriod={payPeriod}
			summary={{ income: totalIncome, allocated: totalAllocated, currency }}
			itemsByCategory={itemsByCategory}
			categories={categories}
			create={create}
			update={update}
			remove={remove}
			onTogglePaid={onToggle}
		/>
	);
}
