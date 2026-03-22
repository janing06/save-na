import { getDatabase } from '@shared/db';
import type { BudgetMonth } from '@shared/lib';
import { rolloverMonth } from './rollover-month';

/**
 * Gets or creates a budget month. If the month doesn't exist,
 * triggers auto-rollover from the most recent existing month.
 */
export async function getBudgetMonth(yearMonth: string): Promise<BudgetMonth> {
	const db = await getDatabase();

	const existing = await db.getFirstAsync<BudgetMonth>(
		'SELECT * FROM budget_month WHERE year_month = ?',
		[yearMonth],
	);

	if (existing) return existing;

	await rolloverMonth(yearMonth);

	const created = await db.getFirstAsync<BudgetMonth>(
		'SELECT * FROM budget_month WHERE year_month = ?',
		[yearMonth],
	);

	return created!;
}
