import { getDatabase } from '@shared/db';

export async function budgetMonthExists(yearMonth: string): Promise<boolean> {
	const db = await getDatabase();
	const result = await db.getFirstAsync<{ id: number }>(
		'SELECT id FROM budget_month WHERE year_month = ?',
		[yearMonth],
	);
	return !!result;
}
