import { getDatabase, insertNotificationConfigs } from '@shared/db';
import type { PaySchedule } from '@shared/lib';

type CreateIncomeSourceInput = {
	name: string;
	amount: number;
	paySchedule: PaySchedule;
	payDates: number[];
	payAmounts?: number[];
};

export async function saveIncomeSource(
	input: CreateIncomeSourceInput,
): Promise<void> {
	const db = await getDatabase();

	const result = await db.runAsync(
		'INSERT INTO income_source (name, amount, pay_schedule, pay_dates, pay_amounts, sort_order) VALUES (?, ?, ?, ?, ?, 0)',
		[
			input.name,
			input.amount,
			input.paySchedule,
			JSON.stringify(input.payDates),
			input.payAmounts ? JSON.stringify(input.payAmounts) : null,
		],
	);

	// Insert default notification configs — scheduling happens after permission is granted at end of onboarding
	await insertNotificationConfigs(result.lastInsertRowId);
}
