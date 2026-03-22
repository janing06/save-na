import { getDatabase } from '@shared/db';
import type { PaySchedule } from '@shared/lib';

type Input = {
	id: number;
	name: string;
	amount: number;
	paySchedule: PaySchedule;
	payDates: number[];
};

export async function updateIncomeSource(input: Input): Promise<void> {
	const db = await getDatabase();
	await db.runAsync(
		`UPDATE income_source SET name = ?, amount = ?, pay_schedule = ?, pay_dates = ?, updated_at = datetime('now') WHERE id = ?`,
		[
			input.name,
			input.amount,
			input.paySchedule,
			JSON.stringify(input.payDates),
			input.id,
		],
	);
}
