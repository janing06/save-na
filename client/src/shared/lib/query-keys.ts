export const queryKeys = {
	incomeSources: ['income-sources'] as const,
	budgetItems: (yearMonth: string, incomeSourceId: number | 'total' | null) =>
		['budget-items', yearMonth, incomeSourceId] as const,
	budgetItemsPrefix: (yearMonth: string) =>
		['budget-items', yearMonth] as const,
	budgetItemsAll: ['budget-items'] as const,
	budgetMonth: (yearMonth: string) => ['budget-month', yearMonth] as const,
	budgetItemById: (id: number) => ['budget-item', id] as const,
	categories: ['categories'] as const,
	preferences: ['preferences'] as const,
	notificationConfigs: (incomeSourceId: number) =>
		['notification-configs', incomeSourceId] as const,
	chatMessages: ['chat-messages'] as const,
	apiKey: ['api-key'] as const,
	theme: ['theme'] as const,
};
