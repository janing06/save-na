import { eq, sql } from 'drizzle-orm';
import { db } from '@shared/db';
import { incomeSource } from '@shared/db';
import type { PaySchedule } from '@shared/lib';

type Input = {
	id: number;
	name: string;
	amount: number;
	paySchedule: PaySchedule;
	payDates: number[];
};

export const updateIncomeSource = async (input: Input): Promise<void> => {
	await db
		.update(incomeSource)
		.set({
			name: input.name,
			amount: input.amount,
			pay_schedule: input.paySchedule,
			pay_dates: JSON.stringify(input.payDates),
			updated_at: sql`(datetime('now'))`,
		})
		.where(eq(incomeSource.id, input.id));
};
