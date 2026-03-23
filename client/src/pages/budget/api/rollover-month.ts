import { getDatabase } from '@shared/db';
import type { PaySchedule } from '@shared/lib';
import { getPayPeriodCount } from '@shared/lib';

/**
 * Creates a new budget month by copying items from the most recent existing month.
 * Recomputes allocations based on the target month's pay period count.
 * If no previous month exists, creates an empty month.
 */
export async function rolloverMonth(yearMonth: string): Promise<void> {
	const db = await getDatabase();

	const latestMonth = await db.getFirstAsync<{
		id: number;
		year_month: string;
	}>(
		'SELECT id, year_month FROM budget_month ORDER BY year_month DESC LIMIT 1',
	);

	if (!latestMonth) {
		await db.runAsync('INSERT INTO budget_month (year_month) VALUES (?)', [
			yearMonth,
		]);
		return;
	}

	const result = await db.runAsync(
		'INSERT INTO budget_month (year_month, created_from_id) VALUES (?, ?)',
		[yearMonth, latestMonth.id],
	);
	const newMonthId = result.lastInsertRowId;

	const items = await db.getAllAsync<{
		id: number;
		income_source_id: number;
		category_id: number;
		name: string;
		total_amount: number;
		split_type: string;
		sort_order: number;
		pay_schedule: string;
		pay_dates: string;
	}>(
		`SELECT bi.id, bi.income_source_id, bi.category_id, bi.name, bi.total_amount,
		        bi.split_type, bi.sort_order, inc.pay_schedule, inc.pay_dates
		 FROM budget_item bi
		 JOIN income_source inc ON inc.id = bi.income_source_id
		 WHERE bi.budget_month_id = ?`,
		[latestMonth.id],
	);

	for (const item of items) {
		const itemResult = await db.runAsync(
			'INSERT INTO budget_item (budget_month_id, income_source_id, category_id, name, total_amount, split_type, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
			[
				newMonthId,
				item.income_source_id,
				item.category_id,
				item.name,
				item.total_amount,
				'even',
				item.sort_order,
			],
		);
		const newItemId = itemResult.lastInsertRowId;

		const periodCount = getPayPeriodCount(
			item.pay_schedule as PaySchedule,
			item.pay_dates,
			yearMonth,
		);
		const evenAmount = item.total_amount / periodCount;

		for (let i = 1; i <= periodCount; i++) {
			await db.runAsync(
				'INSERT INTO budget_item_allocation (budget_item_id, pay_period_index, amount, is_paid) VALUES (?, ?, ?, 0)',
				[newItemId, i, evenAmount],
			);
		}
	}
}
