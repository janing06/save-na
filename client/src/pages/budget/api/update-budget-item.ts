import { eq, sql } from 'drizzle-orm';
import { db } from '@shared/db';
import { budgetItem, budgetItemAllocation } from '@shared/db';
import type { SplitType } from '@shared/lib';

type Input = {
	id: number;
	categoryId: number;
	name: string;
	totalAmount: number;
	splitType: SplitType;
	customAllocations?: { payPeriodIndex: number; amount: number }[];
	paySchedule: string;
	payDatesJson: string;
	yearMonth: string;
};

export const updateBudgetItem = async (input: Input): Promise<void> => {
	await db
		.update(budgetItem)
		.set({
			category_id: input.categoryId,
			name: input.name,
			total_amount: input.totalAmount,
			split_type: input.splitType,
			updated_at: sql`(datetime('now'))`,
		})
		.where(eq(budgetItem.id, input.id));

	// Delete existing allocations and re-insert
	await db
		.delete(budgetItemAllocation)
		.where(eq(budgetItemAllocation.budget_item_id, input.id));

	if (input.splitType === 'custom' && input.customAllocations) {
		for (const alloc of input.customAllocations) {
			await db.insert(budgetItemAllocation).values({
				budget_item_id: input.id,
				pay_period_index: alloc.payPeriodIndex,
				amount: alloc.amount,
			});
		}
	} else {
		const { getPayPeriodCount } = await import('@shared/lib');
		const periodCount = getPayPeriodCount(
			input.paySchedule as 'monthly' | 'bi-monthly' | 'bi-weekly' | 'weekly',
			input.payDatesJson,
			input.yearMonth,
		);
		const evenAmount = input.totalAmount / periodCount;
		for (let i = 1; i <= periodCount; i++) {
			await db.insert(budgetItemAllocation).values({
				budget_item_id: input.id,
				pay_period_index: i,
				amount: evenAmount,
			});
		}
	}
};
