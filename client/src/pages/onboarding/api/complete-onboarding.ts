import { getDatabase } from '@shared/db';
import { currentYearMonth } from '@shared/lib';

export async function completeOnboarding(currency: string): Promise<void> {
	const db = await getDatabase();

	await db.runAsync(
		'INSERT OR REPLACE INTO user_preferences (id, currency) VALUES (1, ?)',
		[currency],
	);

	const yearMonth = currentYearMonth();
	await db.runAsync(
		'INSERT OR IGNORE INTO budget_month (year_month) VALUES (?)',
		[yearMonth],
	);
}
