import { getDatabase } from '@shared/db';

export async function updateCurrency(currency: string): Promise<void> {
	const db = await getDatabase();
	await db.runAsync(
		`UPDATE user_preferences SET currency = ?, updated_at = datetime('now') WHERE id = 1`,
		[currency],
	);
}
