import { queryKeys } from '@shared/lib';
import { useQuery } from '@tanstack/react-query';
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
			if (!budgetMonthRecord) {
				return { items: [], budgetMonthId: null };
			}
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
