import { getPreferences } from '@shared/db';
import { queryKeys } from '@shared/lib';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import type { BudgetItemWithAllocations } from '../api/list-budget-items';
import {
	useBudgetItems,
	useBudgetMonth,
	usePayPeriodToggle,
	useSourceSwitcher,
	useTogglePaid,
} from '../model/hooks';
import { BudgetItemFormContainer } from './budget-item-form-container';
import { BudgetPage } from './budget-page';

type Props = {
	onOpenChat: () => void;
};

export const BudgetPageContainer = ({ onOpenChat }: Props) => {
	const month = useBudgetMonth();
	const switcher = useSourceSwitcher();
	const payPeriod = usePayPeriodToggle(
		switcher.selectedSource,
		month.yearMonth,
	);
	const { items, isLoading } = useBudgetItems(
		month.yearMonth,
		switcher.selectedSourceId,
	);
	const { onToggle } = useTogglePaid(month.yearMonth);

	const [viewMode, setViewMode] = useState<'list' | 'charts'>('list');

	const { data: prefs } = useQuery({
		queryKey: queryKeys.preferences,
		queryFn: getPreferences,
	});
	const currency = prefs?.currency ?? 'PHP';

	const [formVisible, setFormVisible] = useState(false);
	const [editingItemId, setEditingItemId] = useState<number | null>(null);

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
		if (isTotal) return switcher.sources.reduce((sum, s) => sum + s.amount, 0);
		const source = switcher.selectedSource;
		const sourceAmount = source?.amount ?? 0;
		if (periodIndex === 'full') return sourceAmount;
		if (source?.pay_amounts) {
			try {
				const amounts: number[] = JSON.parse(source.pay_amounts);
				const periodAmount = amounts[(periodIndex as number) - 1];
				if (periodAmount !== undefined) return periodAmount;
			} catch {}
		}
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

	const onAdd = () => {
		if (!switcher.selectedSource) return;
		setEditingItemId(null);
		setFormVisible(true);
	};

	const onEdit = (item: BudgetItemWithAllocations) => {
		if (!switcher.selectedSource) return;
		setEditingItemId(item.id);
		setFormVisible(true);
	};

	return (
		<>
			<BudgetPage
				month={{
					label: month.label,
					onPrev: month.onPrev,
					onNext: month.onNext,
					isCurrentMonth: month.isCurrentMonth,
					hasPrevMonth: month.hasPrevMonth,
				}}
				sourceSwitcher={switcher}
				payPeriod={payPeriod}
				summary={{ income: totalIncome, allocated: totalAllocated, currency }}
				itemsByCategory={itemsByCategory}
				onAdd={onAdd}
				onEdit={onEdit}
				onTogglePaid={onToggle}
				onOpenChat={onOpenChat}
				viewMode={viewMode}
				onToggleViewMode={(mode) => {
					if (mode === 'charts') payPeriod.onSelect('full');
					setViewMode(mode);
				}}
				isLoading={isLoading}
			/>
			<BudgetItemFormContainer
				visible={formVisible}
				incomeSourceId={switcher.selectedSource?.id ?? null}
				yearMonth={month.yearMonth}
				editingItemId={editingItemId}
				onClose={() => setFormVisible(false)}
			/>
		</>
	);
};
