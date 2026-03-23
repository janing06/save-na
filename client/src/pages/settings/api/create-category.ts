import { sql } from 'drizzle-orm';
import { db } from '@shared/db';
import { category } from '@shared/db';

export const createCategory = async (name: string): Promise<void> => {
	const maxResult = await db
		.select({ maxOrder: sql<number>`MAX(${category.sort_order})` })
		.from(category);
	const sortOrder = (maxResult[0]?.maxOrder ?? -1) + 1;

	await db.insert(category).values({ name, sort_order: sortOrder });
};
