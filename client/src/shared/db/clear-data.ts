import { seedDefaultCategories } from './seed';
import { getDatabase } from './client';

export async function clearAllData(): Promise<void> {
	const db = await getDatabase();

	// Delete in FK-safe order
	await db.runAsync('DELETE FROM budget_item_allocation');
	await db.runAsync('DELETE FROM budget_item');
	await db.runAsync('DELETE FROM budget_month');
	await db.runAsync('DELETE FROM income_source');
	await db.runAsync('DELETE FROM category');
	await db.runAsync('DELETE FROM user_preferences');

	await seedDefaultCategories(db);
}
