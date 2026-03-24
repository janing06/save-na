export const queryKeys = {
	incomeSources: ['income-sources'] as const,
	budgetItems: (yearMonth: string, incomeSourceId: number | 'total' | null) =>
		['budget-items', yearMonth, incomeSourceId] as const,
	budgetItemsPrefix: (yearMonth: string) =>
		['budget-items', yearMonth] as const,
	categories: ['categories'] as const,
	preferences: ['preferences'] as const,
};
