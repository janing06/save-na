import { getDatabase, getPreferences, listIncomeSources } from '@shared/db';
import { type BudgetItemAllocation, computePayPeriods } from '@shared/lib';

type BudgetItemRow = {
	id: number;
	income_source_id: number;
	name: string;
	total_amount: number;
	category_name: string;
};

type PastMonthSummary = {
	year_month: string;
	category_name: string;
	total_budgeted: number;
	total_checked: number;
};

export async function buildBudgetContext(): Promise<string> {
	const preferences = await getPreferences();
	const incomeSources = await listIncomeSources();

	const currency = preferences?.currency ?? 'PHP';
	const yearMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

	const db = await getDatabase();

	// Current month — full detail
	const budgetItems = await db.getAllAsync<BudgetItemRow>(
		`SELECT bi.id, bi.income_source_id, bi.name, bi.total_amount, c.name as category_name
		 FROM budget_item bi
		 JOIN budget_month bm ON bi.budget_month_id = bm.id
		 JOIN category c ON bi.category_id = c.id
		 WHERE bm.year_month = ?
		 ORDER BY c.sort_order ASC, bi.sort_order ASC`,
		[yearMonth],
	);

	const allocations = await db.getAllAsync<
		BudgetItemAllocation & { budget_item_id: number }
	>(
		`SELECT bia.*
		 FROM budget_item_allocation bia
		 JOIN budget_item bi ON bia.budget_item_id = bi.id
		 JOIN budget_month bm ON bi.budget_month_id = bm.id
		 WHERE bm.year_month = ?
		 ORDER BY bia.pay_period_index ASC`,
		[yearMonth],
	);

	// Past months — category-level summary (last 5 months)
	const pastMonths = await db.getAllAsync<PastMonthSummary>(
		`SELECT bm.year_month, c.name as category_name,
		        SUM(bi.total_amount) as total_budgeted,
		        SUM(CASE WHEN bia.is_paid = 1 THEN bia.amount ELSE 0 END) as total_checked
		 FROM budget_month bm
		 JOIN budget_item bi ON bi.budget_month_id = bm.id
		 JOIN category c ON bi.category_id = c.id
		 LEFT JOIN budget_item_allocation bia ON bia.budget_item_id = bi.id
		 WHERE bm.year_month < ?
		 GROUP BY bm.year_month, c.name
		 ORDER BY bm.year_month DESC, c.sort_order ASC
		 LIMIT 50`,
		[yearMonth],
	);

	const getAllocationsForItem = (itemId: number) =>
		allocations.filter((a) => a.budget_item_id === itemId);

	const totalIncome = incomeSources.reduce(
		(sum: number, s) => sum + s.amount,
		0,
	);
	const totalBudgeted = budgetItems.reduce(
		(sum: number, b) => sum + b.total_amount,
		0,
	);
	const totalChecked = allocations
		.filter((a) => a.is_paid)
		.reduce((sum: number, a) => sum + a.amount, 0);

	let context = `
  You are SaveNa, a personal budget assistant for a Filipino user.
  SaveNa is a budgeting app built around pay schedules — users allocate budget items per income source across their pay periods (e.g. 15th and 30th of the month).
  Each budget item can be checked off per pay period to track what has already been accounted for.

  You have access to the user's complete financial data for the current month and summaries of past months.
  Use this data to answer questions accurately. Do not make up numbers — only reference what is in the data provided.

  Only answer questions related to budgeting, personal finance, and saving. If the user asks something unrelated, politely redirect them back to their budget.
  You do not have access to the internet or real-time data. If the user asks about current prices, exchange rates, or any real-world data not in the provided financial data, honestly tell them you don't have access to current information and suggest they check online instead. Never guess or make up figures.

  Respond in English by default, but switch to Filipino (Tagalog) if the user writes in Filipino.
  Always use ${currency} when mentioning amounts.
  Keep answers friendly, concise, and practical — like a knowledgeable friend helping with finances.
  IMPORTANT — you MUST follow these formatting rules strictly, no exceptions:
  - Format responses in Markdown with clean, well-structured presentation
  - Do NOT use headings (# or ##)
  - NEVER use markdown tables — always use bullet points to compare values instead
  - Use bold text to highlight key figures
  - Use emojis to make responses more engaging
  - Use proper spacing between sections to keep responses easy to read
`;

	context += `=== CURRENT MONTH: ${yearMonth} ===\n\n`;

	// Income sources with pay period breakdown
	context += `INCOME SOURCES:\n`;
	for (const source of incomeSources) {
		const payPeriods = computePayPeriods(
			source.pay_schedule,
			source.pay_dates,
			yearMonth,
		);
		const payAmounts: number[] = source.pay_amounts
			? JSON.parse(source.pay_amounts)
			: [];

		context += `- ${source.name}: ${currency} ${source.amount.toLocaleString()} total (${source.pay_schedule})\n`;
		context += `  Pay periods this month:\n`;
		for (const period of payPeriods) {
			const amount =
				payAmounts.length > 0
					? payAmounts[period.index - 1]
					: source.amount / payPeriods.length;
			context += `  - ${period.label} (day ${period.date}): ${currency} ${amount.toLocaleString()}\n`;
		}
	}
	context += `Total monthly income: ${currency} ${totalIncome.toLocaleString()}\n\n`;

	// Budget items with per-period allocations and checked status
	context += `BUDGET ITEMS WITH PAY PERIOD ALLOCATIONS:\n`;
	for (const source of incomeSources) {
		const sourceItems = budgetItems.filter(
			(b) => b.income_source_id === source.id,
		);
		if (sourceItems.length === 0) continue;

		const payPeriods = computePayPeriods(
			source.pay_schedule,
			source.pay_dates,
			yearMonth,
		);
		context += `\nFrom ${source.name}:\n`;

		for (const item of sourceItems) {
			const itemAllocations = getAllocationsForItem(item.id);
			const checkedAmount = itemAllocations
				.filter((a) => a.is_paid)
				.reduce((s: number, a) => s + a.amount, 0);
			const uncheckedAmount = itemAllocations
				.filter((a) => !a.is_paid)
				.reduce((s: number, a) => s + a.amount, 0);

			context += `- ${item.name} (${item.category_name}): ${currency} ${item.total_amount.toLocaleString()} total\n`;
			for (const allocation of itemAllocations) {
				const period = payPeriods.find(
					(p) => p.index === allocation.pay_period_index,
				);
				const label = period
					? period.label
					: `Period ${allocation.pay_period_index}`;
				const status = allocation.is_paid ? '✅ checked' : '⏳ unchecked';
				context += `  - ${label}: ${currency} ${allocation.amount.toLocaleString()} — ${status}\n`;
			}
			if (checkedAmount > 0)
				context += `  Checked so far: ${currency} ${checkedAmount.toLocaleString()}\n`;
			if (uncheckedAmount > 0)
				context += `  Still unchecked: ${currency} ${uncheckedAmount.toLocaleString()}\n`;
		}
	}

	context += `\nSUMMARY:\n`;
	context += `- Total income: ${currency} ${totalIncome.toLocaleString()}\n`;
	context += `- Total budgeted: ${currency} ${totalBudgeted.toLocaleString()}\n`;
	context += `- Unallocated: ${currency} ${(totalIncome - totalBudgeted).toLocaleString()}\n`;
	context += `- Checked so far: ${currency} ${totalChecked.toLocaleString()}\n`;
	context += `- Unchecked remaining: ${currency} ${(totalBudgeted - totalChecked).toLocaleString()}\n`;

	// Past months — category summaries grouped by month
	if (pastMonths.length > 0) {
		context += `\n=== PAST MONTHS (category summaries) ===\n`;
		const monthGroups = new Map<string, PastMonthSummary[]>();
		for (const row of pastMonths) {
			if (!monthGroups.has(row.year_month)) monthGroups.set(row.year_month, []);
			monthGroups.get(row.year_month)?.push(row);
		}

		for (const [month, rows] of monthGroups) {
			const monthTotal = rows.reduce((s: number, r) => s + r.total_budgeted, 0);
			const monthChecked = rows.reduce(
				(s: number, r) => s + r.total_checked,
				0,
			);
			context += `\n${month}:\n`;
			for (const row of rows) {
				context += `- ${row.category_name}: ${currency} ${row.total_budgeted.toLocaleString()} budgeted, ${currency} ${row.total_checked.toLocaleString()} checked\n`;
			}
			context += `Total: ${currency} ${monthTotal.toLocaleString()} budgeted, ${currency} ${monthChecked.toLocaleString()} checked\n`;
		}
	}

	return context;
}
