import { getDatabase } from '@shared/db';
import type { BudgetItem, BudgetItemAllocation } from '@shared/lib';
import type { BudgetItemWithAllocations } from './list-budget-items';

/** Fetches a single budget item by ID, including its category name and allocations. */
export async function getBudgetItemById(
	id: number,
): Promise<BudgetItemWithAllocations | null> {
	const db = await getDatabase();

	const item = await db.getFirstAsync<
		BudgetItem & { category_name: string; income_source_name: string | null }
	>(
		`SELECT bi.*, c.name as category_name, is2.name as income_source_name
		 FROM budget_item bi
		 JOIN category c ON c.id = bi.category_id
		 LEFT JOIN income_source is2 ON is2.id = bi.income_source_id
		 WHERE bi.id = ?`,
		[id],
	);

	if (!item) return null;

	const allocations = await db.getAllAsync<BudgetItemAllocation>(
		'SELECT * FROM budget_item_allocation WHERE budget_item_id = ? ORDER BY pay_period_index ASC',
		[id],
	);

	return { ...item, allocations };
}
