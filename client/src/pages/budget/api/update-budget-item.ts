import { getDatabase } from '@shared/db';
import type { SplitType } from '@shared/lib';
import { getPayPeriodCount } from '@shared/lib';

type Input = {
	id: number;
	categoryId: number;
	name: string;
	totalAmount: number;
	splitType: SplitType;
	customAllocations?: { payPeriodIndex: number; amount: number }[];
	paySchedule: string;
	payDatesJson: string;
	yearMonth: string;
	dueDay: number | null;
};

export async function updateBudgetItem(input: Input): Promise<void> {
	const db = await getDatabase();

	await db.runAsync(
		`UPDATE budget_item SET category_id = ?, name = ?, total_amount = ?, split_type = ?, due_day = ?, updated_at = datetime('now') WHERE id = ?`,
		[
			input.categoryId,
			input.name,
			input.totalAmount,
			input.splitType,
			input.dueDay,
			input.id,
		],
	);

	// Recreate allocations
	await db.runAsync(
		'DELETE FROM budget_item_allocation WHERE budget_item_id = ?',
		[input.id],
	);

	if (input.splitType === 'custom' && input.customAllocations) {
		for (const alloc of input.customAllocations) {
			await db.runAsync(
				'INSERT INTO budget_item_allocation (budget_item_id, pay_period_index, amount) VALUES (?, ?, ?)',
				[input.id, alloc.payPeriodIndex, alloc.amount],
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
				[input.id, i, evenAmount],
			);
		}
	}
}
