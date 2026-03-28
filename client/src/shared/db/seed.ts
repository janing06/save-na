import { defaultCategories } from '@shared/config';
import type { SQLiteDatabase } from 'expo-sqlite';

export async function seedDefaultCategories(db: SQLiteDatabase): Promise<void> {
	const existing = await db.getFirstAsync<{ count: number }>(
		'SELECT COUNT(*) as count FROM category',
	);
	if (existing && existing.count > 0) return;

	for (const cat of defaultCategories) {
		await db.runAsync(
			'INSERT INTO category (name, sort_order, is_default) VALUES (?, ?, 1)',
			[cat.name, cat.sort_order],
		);
	}
}
