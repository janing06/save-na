import { eq, sql } from 'drizzle-orm';
import { db } from '@shared/db';
import { category } from '@shared/db';

export const updateCategory = async (
	id: number,
	name: string,
): Promise<void> => {
	await db
		.update(category)
		.set({ name, updated_at: sql`(datetime('now'))` })
		.where(eq(category.id, id));
};
