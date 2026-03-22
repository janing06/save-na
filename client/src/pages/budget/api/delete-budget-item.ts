import { getDatabase } from '@shared/db';

export async function deleteBudgetItem(id: number): Promise<void> {
	const db = await getDatabase();
	await db.runAsync('DELETE FROM budget_item WHERE id = ?', [id]);
}
