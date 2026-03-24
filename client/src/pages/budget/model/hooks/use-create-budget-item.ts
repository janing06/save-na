import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
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
			queryClient.invalidateQueries({
				queryKey: queryKeys.budgetItemsPrefix(yearMonth),
			});
			setShowModal(false);
		},
		onError: () => {
			Alert.alert('Error', 'Failed to create budget item. Please try again.');
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
