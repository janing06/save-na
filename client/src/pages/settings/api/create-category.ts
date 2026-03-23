import { getDatabase } from '@shared/db';

export async function createCategory(name: string): Promise<void> {
	const db = await getDatabase();
	const maxOrder = await db.getFirstAsync<{ max_order: number | null }>(
		'SELECT MAX(sort_order) as max_order FROM category',
	);
	const sortOrder = (maxOrder?.max_order ?? -1) + 1;

	await db.runAsync(
		'INSERT INTO category (name, sort_order, is_default) VALUES (?, ?, 0)',
		[name, sortOrder],
	);
}
