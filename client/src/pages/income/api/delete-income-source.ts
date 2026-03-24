import { getDatabase } from '@shared/db';

export async function deleteIncomeSource(id: number): Promise<void> {
	const db = await getDatabase();
	// Delete budget items first (allocations cascade via FK ON DELETE CASCADE)
	await db.runAsync('DELETE FROM budget_item WHERE income_source_id = ?', [id]);
	await db.runAsync('DELETE FROM income_source WHERE id = ?', [id]);
}
