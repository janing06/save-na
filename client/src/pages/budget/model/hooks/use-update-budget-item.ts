import { useState } from 'react';
import type { IncomeSource, SplitType } from '@shared/lib';
import type { BudgetItemWithAllocations } from '../../api/list-budget-items';
import { updateBudgetItem } from '../../api/update-budget-item';

export function useUpdateBudgetItem(
	selectedSource: IncomeSource | null,
	yearMonth: string,
	onSuccess: () => void,
) {
	const [editingItem, setEditingItem] =
		useState<BudgetItemWithAllocations | null>(null);
	const [isPending, setIsPending] = useState(false);

	const onEdit = (item: BudgetItemWithAllocations) => setEditingItem(item);
	const onCancel = () => setEditingItem(null);

	const onSubmit = async (input: {
		categoryId: number;
		name: string;
		totalAmount: number;
		splitType: SplitType;
		customAllocations?: { payPeriodIndex: number; amount: number }[];
	}) => {
		if (!editingItem || !selectedSource) return;
		setIsPending(true);
		try {
			await updateBudgetItem({
				id: editingItem.id,
				categoryId: input.categoryId,
				name: input.name,
				totalAmount: input.totalAmount,
				splitType: input.splitType,
				customAllocations: input.customAllocations,
				paySchedule: selectedSource.pay_schedule,
				payDatesJson: selectedSource.pay_dates,
				yearMonth,
			});
			setEditingItem(null);
			onSuccess();
		} finally {
			setIsPending(false);
		}
	};

	return { editingItem, onEdit, onCancel, onSubmit, isPending };
}
