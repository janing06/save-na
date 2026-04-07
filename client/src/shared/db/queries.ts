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

export type BudgetItemDueDateRow = {
	id: number;
	name: string;
	total_amount: number;
	due_day: number;
};

export async function listBudgetItemsWithDueDay(): Promise<
	BudgetItemDueDateRow[]
> {
	const db = await getDatabase();
	// GROUP BY name, due_day to deduplicate the same bill across multiple months
	return db.getAllAsync<BudgetItemDueDateRow>(
		'SELECT MIN(id) as id, name, MAX(total_amount) as total_amount, due_day FROM budget_item WHERE due_day IS NOT NULL GROUP BY name, due_day',
	);
}
