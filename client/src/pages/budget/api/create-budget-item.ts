import { getDatabase } from '@shared/db';
import type { SplitType } from '@shared/lib';
import { getPayPeriodCount } from '@shared/lib';

type Input = {
	budgetMonthId: number;
	incomeSourceId: number;
	categoryId: number;
	name: string;
	totalAmount: number;
	splitType: SplitType;
	customAllocations?: { payPeriodIndex: number; amount: number }[];
	paySchedule: string;
	payDatesJson: string;
	yearMonth: string;
};

export async function createBudgetItem(input: Input): Promise<void> {
	const db = await getDatabase();

	const maxOrder = await db.getFirstAsync<{ max_order: number | null }>(
		'SELECT MAX(sort_order) as max_order FROM budget_item WHERE budget_month_id = ? AND category_id = ?',
		[input.budgetMonthId, input.categoryId],
	);
	const sortOrder = (maxOrder?.max_order ?? -1) + 1;

	const result = await db.runAsync(
		'INSERT INTO budget_item (budget_month_id, income_source_id, category_id, name, total_amount, split_type, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
		[
			input.budgetMonthId,
			input.incomeSourceId,
			input.categoryId,
			input.name,
			input.totalAmount,
			input.splitType,
			sortOrder,
		],
	);
	const itemId = result.lastInsertRowId;

	if (input.splitType === 'custom' && input.customAllocations) {
		for (const alloc of input.customAllocations) {
			await db.runAsync(
				'INSERT INTO budget_item_allocation (budget_item_id, pay_period_index, amount) VALUES (?, ?, ?)',
				[itemId, alloc.payPeriodIndex, alloc.amount],
			);
		}
	} else {
		const periodCount = getPayPeriodCount(
			input.paySchedule as 'monthly' | 'bi-monthly' | 'bi-weekly' | 'weekly',
			input.payDatesJson,
			input.yearMonth,
		);
		const evenAmount = input.totalAmount / periodCount;

		for (let i = 1; i <= periodCount; i++) {
			await db.runAsync(
				'INSERT INTO budget_item_allocation (budget_item_id, pay_period_index, amount) VALUES (?, ?, ?)',
				[itemId, i, evenAmount],
			);
		}
	}
}
