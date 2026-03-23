import { getDatabase } from '@shared/db';

export async function togglePaid(allocationId: number): Promise<void> {
	const db = await getDatabase();
	await db.runAsync(
		`UPDATE budget_item_allocation SET is_paid = CASE WHEN is_paid = 0 THEN 1 ELSE 0 END, updated_at = datetime('now') WHERE id = ?`,
		[allocationId],
	);
}
