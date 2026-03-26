import { getDatabase } from '@shared/db';
import type { BudgetItem, BudgetItemAllocation } from '@shared/lib';
import type { BudgetItemWithAllocations } from './list-budget-items';

export async function getBudgetItemById(
	id: number,
): Promise<BudgetItemWithAllocations | null> {
	const db = await getDatabase();

	const item = await db.getFirstAsync<BudgetItem & { category_name: string }>(
		`SELECT bi.*, c.name as category_name
		 FROM budget_item bi
		 JOIN category c ON c.id = bi.category_id
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
