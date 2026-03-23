import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBudgetItem } from '../../api/create-budget-item';
import { queryKeys } from '@shared/lib';
import type { IncomeSource, SplitType } from '@shared/lib';

export const useCreateBudgetItem = (
	budgetMonthId: number | null,
	selectedSource: IncomeSource | null,
	yearMonth: string,
) => {
	const queryClient = useQueryClient();
	const [showModal, setShowModal] = useState(false);

	const mutation = useMutation({
		mutationFn: createBudgetItem,
		onSuccess: () => {
			// Partial key ['budget-items', yearMonth] intentionally invalidates ALL
			// incomeSourceId variants for this month (TanStack Query prefix match)
			queryClient.invalidateQueries({ queryKey: ['budget-items', yearMonth] });
			setShowModal(false);
		},
	});

	return {
		showModal,
		onShow: () => setShowModal(true),
		onHide: () => setShowModal(false),
		onSubmit: (input: {
			categoryId: number;
			name: string;
			totalAmount: number;
			splitType: SplitType;
			customAllocations?: { payPeriodIndex: number; amount: number }[];
		}) => {
			if (!budgetMonthId || !selectedSource) return;
			mutation.mutate({
				budgetMonthId,
				incomeSourceId: selectedSource.id,
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
