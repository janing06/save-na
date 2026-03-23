import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBudgetItem } from '../../api/update-budget-item';
import type { BudgetItemWithAllocations } from '../../api/list-budget-items';
import { queryKeys } from '@shared/lib';
import type { IncomeSource, SplitType } from '@shared/lib';

export const useUpdateBudgetItem = (
	selectedSource: IncomeSource | null,
	yearMonth: string,
) => {
	const queryClient = useQueryClient();
	const [editingItem, setEditingItem] = useState<BudgetItemWithAllocations | null>(null);

	const mutation = useMutation({
		mutationFn: updateBudgetItem,
		onSuccess: () => {
			// Partial key — invalidates all incomeSourceId variants for this month
			queryClient.invalidateQueries({ queryKey: ['budget-items', yearMonth] });
			setEditingItem(null);
		},
	});

	return {
		editingItem,
		onEdit: (item: BudgetItemWithAllocations) => setEditingItem(item),
		onCancel: () => setEditingItem(null),
		onSubmit: (input: {
			categoryId: number;
			name: string;
			totalAmount: number;
			splitType: SplitType;
			customAllocations?: { payPeriodIndex: number; amount: number }[];
		}) => {
			if (!editingItem || !selectedSource) return;
			mutation.mutate({
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
		},
		isPending: mutation.isPending,
	};
};
