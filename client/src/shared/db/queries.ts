import type { Category, IncomeSource, UserPreferences } from '@shared/lib';
import { getDatabase } from './client';

export async function listIncomeSources(): Promise<IncomeSource[]> {
	const db = await getDatabase();
	return db.getAllAsync<IncomeSource>(
		'SELECT * FROM income_source ORDER BY sort_order ASC',
	);
}

export async function listCategories(): Promise<Category[]> {
	const db = await getDatabase();
	return db.getAllAsync<Category>(
		'SELECT * FROM category ORDER BY sort_order ASC',
	);
}

export async function getPreferences(): Promise<UserPreferences | null> {
	const db = await getDatabase();
	return db.getFirstAsync<UserPreferences>(
		'SELECT * FROM user_preferences WHERE id = 1',
	);
}
