import { eq } from 'drizzle-orm';
import { db } from '@shared/db';
import { category } from '@shared/db';

export const deleteCategory = async (id: number): Promise<void> => {
	await db.delete(category).where(eq(category.id, id));
};
