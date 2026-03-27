import { getDatabase } from '@shared/db';

export async function deleteCategory(id: number): Promise<void> {
	const db = await getDatabase();

	const others = await db.getFirstAsync<{ id: number }>(
		"SELECT id FROM category WHERE name = 'Others' AND is_default = 1",
	);

	if (!others) {
		throw new Error('Others category not found. Cannot reassign budget items.');
	}

	await db.withTransactionAsync(async () => {
		await db.runAsync(
			'UPDATE budget_item SET category_id = ? WHERE category_id = ?',
			[others.id, id],
		);
		await db.runAsync('DELETE FROM category WHERE id = ? AND is_default = 0', [
			id,
		]);
	});
}
