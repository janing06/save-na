import { eq, sql } from 'drizzle-orm';
import { db } from '@shared/db';
import { budgetItemAllocation } from '@shared/db';

export const togglePaid = async (allocationId: number): Promise<void> => {
	await db
		.update(budgetItemAllocation)
		.set({
			is_paid: sql`CASE WHEN ${budgetItemAllocation.is_paid} = 0 THEN 1 ELSE 0 END`,
			updated_at: sql`(datetime('now'))`,
		})
		.where(eq(budgetItemAllocation.id, allocationId));
};
