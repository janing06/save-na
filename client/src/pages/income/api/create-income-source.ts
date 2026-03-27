import { getDatabase, insertNotificationConfigs } from '@shared/db';
import type { NotificationSettings, PaySchedule } from '@shared/lib';
import { rescheduleAllNotifications } from '@shared/lib';

type Input = {
	name: string;
	amount: number;
	paySchedule: PaySchedule;
	payDates: number[];
	payAmounts?: number[];
	notifications: NotificationSettings;
};

export async function createIncomeSource(input: Input): Promise<void> {
	const db = await getDatabase();
	const maxOrder = await db.getFirstAsync<{ max_order: number | null }>(
		'SELECT MAX(sort_order) as max_order FROM income_source',
	);
	const sortOrder = (maxOrder?.max_order ?? -1) + 1;

	const result = await db.runAsync(
		'INSERT INTO income_source (name, amount, pay_schedule, pay_dates, pay_amounts, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
		[
			input.name,
			input.amount,
			input.paySchedule,
			JSON.stringify(input.payDates),
			input.payAmounts ? JSON.stringify(input.payAmounts) : null,
			sortOrder,
		],
	);

	await insertNotificationConfigs(result.lastInsertRowId, input.notifications);
	await rescheduleAllNotifications();
}
