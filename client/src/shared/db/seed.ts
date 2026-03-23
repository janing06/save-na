import { defaultCategories } from '@shared/config';
import { db } from './client';
import { category } from './schema';

export const seedDefaultCategories = async (): Promise<void> => {
	const existing = await db.select().from(category).limit(1);
	if (existing.length > 0) return;

	for (const cat of defaultCategories) {
		await db.insert(category).values({
			name: cat.name,
			sort_order: cat.sort_order,
			is_default: 1,
		});
	}
};
