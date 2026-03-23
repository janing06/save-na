import { asc, desc, eq } from 'drizzle-orm';
import { db } from '@shared/db';
import {
	budgetItem,
	budgetItemAllocation,
	budgetMonth,
	incomeSource,
} from '@shared/db';
import { getPayPeriodCount } from '@shared/lib';
import type { PaySchedule } from '@shared/lib';

export const rolloverMonth = async (yearMonth: string): Promise<void> => {
	const latestMonth = await db
		.select({ id: budgetMonth.id, year_month: budgetMonth.year_month })
		.from(budgetMonth)
		.orderBy(desc(budgetMonth.year_month))
		.limit(1);

	if (latestMonth.length === 0) {
		await db.insert(budgetMonth).values({ year_month: yearMonth });
		return;
	}

	const [newMonth] = await db
		.insert(budgetMonth)
		.values({ year_month: yearMonth, created_from_id: latestMonth[0].id })
		.returning();

	const items = await db
		.select({
			id: budgetItem.id,
			income_source_id: budgetItem.income_source_id,
			category_id: budgetItem.category_id,
			name: budgetItem.name,
			total_amount: budgetItem.total_amount,
			sort_order: budgetItem.sort_order,
			pay_schedule: incomeSource.pay_schedule,
			pay_dates: incomeSource.pay_dates,
		})
		.from(budgetItem)
		.innerJoin(incomeSource, eq(incomeSource.id, budgetItem.income_source_id))
		.where(eq(budgetItem.budget_month_id, latestMonth[0].id))
		.orderBy(asc(budgetItem.sort_order));

	for (const item of items) {
		const [newItem] = await db
			.insert(budgetItem)
			.values({
				budget_month_id: newMonth.id,
				income_source_id: item.income_source_id,
				category_id: item.category_id,
				name: item.name,
				total_amount: item.total_amount,
				split_type: 'even',
				sort_order: item.sort_order,
			})
			.returning();

		const periodCount = getPayPeriodCount(
			item.pay_schedule as PaySchedule,
			item.pay_dates,
			yearMonth,
		);
		const evenAmount = item.total_amount / periodCount;

		for (let i = 1; i <= periodCount; i++) {
			await db.insert(budgetItemAllocation).values({
				budget_item_id: newItem.id,
				pay_period_index: i,
				amount: evenAmount,
				is_paid: 0,
			});
		}
	}
};
