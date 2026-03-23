import { getDatabase } from '@shared/db';

export async function deleteIncomeSource(
	id: number,
): Promise<{ blocked: boolean }> {
	const db = await getDatabase();
	const hasItems = await db.getFirstAsync<{ count: number }>(
		'SELECT COUNT(*) as count FROM budget_item WHERE income_source_id = ?',
		[id],
	);

	if (hasItems && hasItems.count > 0) {
		return { blocked: true };
	}

	await db.runAsync('DELETE FROM income_source WHERE id = ?', [id]);
	return { blocked: false };
}
