import { and, eq, sql } from 'drizzle-orm';
import { db } from '@shared/db';
import { budgetItem, budgetItemAllocation } from '@shared/db';
import { getPayPeriodCount } from '@shared/lib';
import type { SplitType } from '@shared/lib';

type Input = {
	budgetMonthId: number;
	incomeSourceId: number;
	categoryId: number;
	name: string;
	totalAmount: number;
	splitType: SplitType;
	customAllocations?: { payPeriodIndex: number; amount: number }[];
	paySchedule: string;
	payDatesJson: string;
	yearMonth: string;
};

export const createBudgetItem = async (input: Input): Promise<void> => {
	const maxResult = await db
		.select({ maxOrder: sql<number>`MAX(${budgetItem.sort_order})` })
		.from(budgetItem)
		.where(
			and(
				eq(budgetItem.budget_month_id, input.budgetMonthId),
				eq(budgetItem.category_id, input.categoryId),
			),
		);
	const sortOrder = (maxResult[0]?.maxOrder ?? -1) + 1;

	const [newItem] = await db
		.insert(budgetItem)
		.values({
			budget_month_id: input.budgetMonthId,
			income_source_id: input.incomeSourceId,
			category_id: input.categoryId,
			name: input.name,
			total_amount: input.totalAmount,
			split_type: input.splitType,
			sort_order: sortOrder,
		})
		.returning();

	if (input.splitType === 'custom' && input.customAllocations) {
		for (const alloc of input.customAllocations) {
			await db.insert(budgetItemAllocation).values({
				budget_item_id: newItem.id,
				pay_period_index: alloc.payPeriodIndex,
				amount: alloc.amount,
			});
		}
	} else {
		const periodCount = getPayPeriodCount(
			input.paySchedule as 'monthly' | 'bi-monthly' | 'bi-weekly' | 'weekly',
			input.payDatesJson,
			input.yearMonth,
		);
		const evenAmount = input.totalAmount / periodCount;
		for (let i = 1; i <= periodCount; i++) {
			await db.insert(budgetItemAllocation).values({
				budget_item_id: newItem.id,
				pay_period_index: i,
				amount: evenAmount,
			});
		}
	}
};
