import { eq } from 'drizzle-orm';
import { db } from '@shared/db';
import { budgetItem } from '@shared/db';

export const deleteBudgetItem = async (id: number): Promise<void> => {
	await db.delete(budgetItem).where(eq(budgetItem.id, id));
};
