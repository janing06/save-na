import { eq } from 'drizzle-orm';
import { db } from '@shared/db';
import { budgetItem, incomeSource } from '@shared/db';

export const deleteIncomeSource = async (
	id: number,
): Promise<{ blocked: boolean }> => {
	const usedIn = await db
		.select({ id: budgetItem.id })
		.from(budgetItem)
		.where(eq(budgetItem.income_source_id, id))
		.limit(1);

	if (usedIn.length > 0) return { blocked: true };

	await db.delete(incomeSource).where(eq(incomeSource.id, id));
	return { blocked: false };
};
