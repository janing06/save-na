import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/lib';
import { getBudgetMonth } from '../../api/get-budget-month';
import { listBudgetItems } from '../../api/list-budget-items';

export const useBudgetItems = (
	yearMonth: string,
	incomeSourceId: number | 'total' | null,
) => {
	const { data, isLoading } = useQuery({
		queryKey: queryKeys.budgetItems(yearMonth, incomeSourceId),
		queryFn: async () => {
			const budgetMonthRecord = await getBudgetMonth(yearMonth);
			const sourceId =
				incomeSourceId === 'total' ? undefined : (incomeSourceId ?? undefined);
			const items = await listBudgetItems(budgetMonthRecord.id, sourceId);
			return { items, budgetMonthId: budgetMonthRecord.id };
		},
	});

	return {
		items: data?.items ?? [],
		budgetMonthId: data?.budgetMonthId ?? null,
		isLoading,
	};
};
