import {
	getDatabase,
	getPreferences,
	listCategories,
	listIncomeSources,
} from '@shared/db';

export async function buildBudgetContext(): Promise<string> {
	const preferences = await getPreferences();
	const incomeSources = await listIncomeSources();
	const categories = await listCategories();

	const currency = preferences?.currency ?? 'PHP';

	// Get current month's budget items
	const yearMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
	const db = await getDatabase();
	const budgetItems = await db.getAllAsync<{
		name: string;
		total_amount: number;
		category_name: string;
		income_source_name: string;
	}>(
		`SELECT bi.name, bi.total_amount, c.name as category_name, i.name as income_source_name
		 FROM budget_item bi
		 JOIN budget_month bm ON bi.budget_month_id = bm.id
		 JOIN category c ON bi.category_id = c.id
		 JOIN income_source i ON bi.income_source_id = i.id
		 WHERE bm.year_month = ?
		 ORDER BY bi.sort_order ASC`,
		[yearMonth],
	);

	const totalIncome = incomeSources.reduce((sum, s) => sum + s.amount, 0);
	const totalBudgeted = budgetItems.reduce((sum, b) => sum + b.total_amount, 0);

	let context = `You are a helpful budget assistant for a Filipino user. Answer in a friendly, concise way. Use the currency ${currency} when mentioning amounts.\n\n`;
	context += `=== FINANCIAL SUMMARY (${yearMonth}) ===\n\n`;

	context += `INCOME SOURCES:\n`;
	for (const source of incomeSources) {
		context += `- ${source.name}: ${currency} ${source.amount.toLocaleString()} (${source.pay_schedule})\n`;
	}
	context += `Total monthly income: ${currency} ${totalIncome.toLocaleString()}\n\n`;

	context += `BUDGET CATEGORIES:\n`;
	for (const cat of categories) {
		const items = budgetItems.filter((b) => b.category_name === cat.name);
		if (items.length > 0) {
			const catTotal = items.reduce((sum, b) => sum + b.total_amount, 0);
			context += `- ${cat.name}: ${currency} ${catTotal.toLocaleString()}\n`;
			for (const item of items) {
				context += `  - ${item.name}: ${currency} ${item.total_amount.toLocaleString()} (from ${item.income_source_name})\n`;
			}
		}
	}
	context += `\nTotal budgeted: ${currency} ${totalBudgeted.toLocaleString()}\n`;
	context += `Remaining: ${currency} ${(totalIncome - totalBudgeted).toLocaleString()}\n`;

	return context;
}
