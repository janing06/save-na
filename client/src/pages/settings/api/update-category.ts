import { getDatabase } from '@shared/db';

export async function updateCategory(id: number, name: string): Promise<void> {
	const db = await getDatabase();
	await db.runAsync(
		`UPDATE category SET name = ?, updated_at = datetime('now') WHERE id = ?`,
		[name, id],
	);
}
