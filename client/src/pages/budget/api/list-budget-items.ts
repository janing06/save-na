import { and, asc, eq } from 'drizzle-orm';
import { db } from '@shared/db';
import {
	budgetItem,
	budgetItemAllocation,
	category,
} from '@shared/db';
import type { BudgetItem, BudgetItemAllocation } from '@shared/lib';

export type BudgetItemWithAllocations = BudgetItem & {
	allocations: BudgetItemAllocation[];
	category_name: string;
};

export const listBudgetItems = async (
	budgetMonthId: number,
	incomeSourceId?: number,
): Promise<BudgetItemWithAllocations[]> => {
	const conditions = [eq(budgetItem.budget_month_id, budgetMonthId)];
	if (incomeSourceId !== undefined) {
		conditions.push(eq(budgetItem.income_source_id, incomeSourceId));
	}

	const items = await db
		.select({
			id: budgetItem.id,
			budget_month_id: budgetItem.budget_month_id,
			income_source_id: budgetItem.income_source_id,
			category_id: budgetItem.category_id,
			name: budgetItem.name,
			total_amount: budgetItem.total_amount,
			split_type: budgetItem.split_type,
			sort_order: budgetItem.sort_order,
			created_at: budgetItem.created_at,
			updated_at: budgetItem.updated_at,
			category_name: category.name,
		})
		.from(budgetItem)
		.innerJoin(category, eq(category.id, budgetItem.category_id))
		.where(and(...conditions))
		.orderBy(asc(category.sort_order), asc(budgetItem.sort_order));

	const result: BudgetItemWithAllocations[] = [];
	for (const item of items) {
		const allocations = await db
			.select()
			.from(budgetItemAllocation)
			.where(eq(budgetItemAllocation.budget_item_id, item.id))
			.orderBy(asc(budgetItemAllocation.pay_period_index));
		result.push({ ...item, allocations });
	}

	return result;
};
