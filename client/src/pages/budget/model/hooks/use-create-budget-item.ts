import type { IncomeSource, SplitType } from '@shared/lib';
import { useState } from 'react';
import { createBudgetItem } from '../../api/create-budget-item';

export const useCreateBudgetItem = (
	budgetMonthId: number | null,
	selectedSource: IncomeSource | null,
	yearMonth: string,
	onSuccess: () => void,
) => {
	const [showModal, setShowModal] = useState(false);
	const [isPending, setIsPending] = useState(false);

	const onShow = () => setShowModal(true);
	const onHide = () => setShowModal(false);

	const onSubmit = async (input: {
		categoryId: number;
		name: string;
		totalAmount: number;
		splitType: SplitType;
		customAllocations?: { payPeriodIndex: number; amount: number }[];
	}) => {
		if (!budgetMonthId || !selectedSource) return;
		setIsPending(true);
		try {
			await createBudgetItem({
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
			setShowModal(false);
			onSuccess();
		} finally {
			setIsPending(false);
		}
	};

	return { showModal, onShow, onHide, onSubmit, isPending };
}
