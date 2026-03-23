import { eq } from 'drizzle-orm';
import { db } from '@shared/db';
import { budgetMonth } from '@shared/db';
import type { BudgetMonth } from '@shared/lib';
import { rolloverMonth } from './rollover-month';

export const getBudgetMonth = async (
	yearMonth: string,
): Promise<BudgetMonth> => {
	const existing = await db
		.select()
		.from(budgetMonth)
		.where(eq(budgetMonth.year_month, yearMonth))
		.limit(1);

	if (existing.length > 0) return existing[0];

	await rolloverMonth(yearMonth);

	const created = await db
		.select()
		.from(budgetMonth)
		.where(eq(budgetMonth.year_month, yearMonth))
		.limit(1);

	return created[0];
};
