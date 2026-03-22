import { Ionicons } from '@expo/vector-icons';
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
		<View className="mx-4 mb-3 rounded-2xl shadow-sm">
			<View className="bg-white rounded-2xl overflow-hidden">
				<Pressable
					className="flex-row justify-between items-center px-4 py-3"
					onPress={() => setExpanded((prev) => !prev)}
				>
					<Text className="text-sm font-bold text-slate-900">{categoryName}</Text>
					<View className="flex-row items-center gap-2">
						<Text className={`text-sm font-bold ${amountColor}`}>
							{formatCurrency(categoryTotal, currency)}
						</Text>
						<Ionicons
							name={expanded ? 'chevron-up' : 'chevron-forward'}
							size={16}
							color="#94a3b8"
						/>
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
		</View>
	);
}
