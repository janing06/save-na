import { getDatabase } from '@shared/db';
import type { BudgetItem, BudgetItemAllocation } from '@shared/lib';

export type BudgetItemWithAllocations = BudgetItem & {
	allocations: BudgetItemAllocation[];
	category_name: string;
};

/**
 * Lists budget items for a month, optionally filtered by income source.
 * Includes allocations and category name.
 */
export async function listBudgetItems(
	budgetMonthId: number,
	incomeSourceId?: number,
): Promise<BudgetItemWithAllocations[]> {
	const db = await getDatabase();

	let query = `
		SELECT bi.*, c.name as category_name
		FROM budget_item bi
		JOIN category c ON c.id = bi.category_id
		WHERE bi.budget_month_id = ?
	`;
	const params: (number | string)[] = [budgetMonthId];

	if (incomeSourceId) {
		query += ' AND bi.income_source_id = ?';
		params.push(incomeSourceId);
	}

	query += ' ORDER BY c.sort_order ASC, bi.sort_order ASC';

	const items = await db.getAllAsync<BudgetItem & { category_name: string }>(
		query,
		params,
	);

	const result: BudgetItemWithAllocations[] = [];
	for (const item of items) {
		const allocations = await db.getAllAsync<BudgetItemAllocation>(
			'SELECT * FROM budget_item_allocation WHERE budget_item_id = ? ORDER BY pay_period_index ASC',
			[item.id],
		);
		result.push({ ...item, allocations });
	}

	return result;
}
