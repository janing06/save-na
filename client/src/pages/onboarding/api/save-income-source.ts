import { sql } from 'drizzle-orm';
import { db } from '@shared/db';
import { incomeSource } from '@shared/db';
import type { PaySchedule } from '@shared/lib';

type Input = {
	name: string;
	amount: number;
	paySchedule: PaySchedule;
	payDates: number[];
};

export const saveIncomeSource = async (input: Input): Promise<void> => {
	const maxResult = await db
		.select({ maxOrder: sql<number>`MAX(${incomeSource.sort_order})` })
		.from(incomeSource);
	const sortOrder = (maxResult[0]?.maxOrder ?? -1) + 1;

	await db.insert(incomeSource).values({
		name: input.name,
		amount: input.amount,
		pay_schedule: input.paySchedule,
		pay_dates: JSON.stringify(input.payDates),
		sort_order: sortOrder,
	});
};
