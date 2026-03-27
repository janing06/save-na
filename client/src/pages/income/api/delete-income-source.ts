import { getDatabase } from '@shared/db';
import { cancelNotificationsForSource } from '@shared/lib';

export async function deleteIncomeSource(id: number): Promise<void> {
	await cancelNotificationsForSource(id);
	const db = await getDatabase();
	await db.runAsync('DELETE FROM budget_item WHERE income_source_id = ?', [id]);
	await db.runAsync('DELETE FROM income_source WHERE id = ?', [id]);
	// notification_config rows are auto-deleted via ON DELETE CASCADE
}
