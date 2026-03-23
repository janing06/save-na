import { asc, eq } from 'drizzle-orm';
import type { Category, IncomeSource, UserPreferences } from './schema';
import { category, incomeSource, userPreferences } from './schema';
import { db } from './client';

export const listIncomeSources = async (): Promise<IncomeSource[]> => {
	return db.select().from(incomeSource).orderBy(asc(incomeSource.sort_order));
};

export const listCategories = async (): Promise<Category[]> => {
	return db.select().from(category).orderBy(asc(category.sort_order));
};

export const getPreferences = async (): Promise<UserPreferences | null> => {
	const result = await db
		.select()
		.from(userPreferences)
		.where(eq(userPreferences.id, 1))
		.limit(1);
	return result[0] ?? null;
};
