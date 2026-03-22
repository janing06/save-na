import { useCallback, useEffect, useState } from 'react';
import { getBudgetMonth } from '../../api/get-budget-month';
import {
	type BudgetItemWithAllocations,
	listBudgetItems,
} from '../../api/list-budget-items';

export function useBudgetItems(
	yearMonth: string,
	incomeSourceId: number | 'total' | null,
) {
	const [items, setItems] = useState<BudgetItemWithAllocations[]>([]);
	const [budgetMonthId, setBudgetMonthId] = useState<number | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const refresh = useCallback(async () => {
		setIsLoading(true);
		const budgetMonth = await getBudgetMonth(yearMonth);
		setBudgetMonthId(budgetMonth.id);

		const sourceId =
			incomeSourceId === 'total' ? undefined : (incomeSourceId ?? undefined);
		const data = await listBudgetItems(budgetMonth.id, sourceId);
		setItems(data);
		setIsLoading(false);
	}, [yearMonth, incomeSourceId]);

	useEffect(() => {
		refresh();
	}, [refresh]);

	return { items, budgetMonthId, isLoading, refresh };
}
