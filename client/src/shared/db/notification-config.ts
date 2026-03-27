import type { NotificationConfig, NotificationSettings } from '@shared/lib';
import { getDatabase } from './client';

export async function insertNotificationConfigs(
	incomeSourceId: number,
	settings: NotificationSettings = {
		paydayEnabled: true,
		paydayTime: '10:00',
		budgetReminderEnabled: true,
		budgetReminderTime: '10:00',
	},
): Promise<void> {
	const db = await getDatabase();
	await db.runAsync(
		`INSERT OR IGNORE INTO notification_config (income_source_id, type, enabled, time)
		 VALUES (?, 'payday', ?, ?)`,
		[incomeSourceId, settings.paydayEnabled ? 1 : 0, settings.paydayTime],
	);
	await db.runAsync(
		`INSERT OR IGNORE INTO notification_config (income_source_id, type, enabled, time)
		 VALUES (?, 'budget_reminder', ?, ?)`,
		[
			incomeSourceId,
			settings.budgetReminderEnabled ? 1 : 0,
			settings.budgetReminderTime,
		],
	);
}

export async function getNotificationConfigsForSource(
	incomeSourceId: number,
): Promise<NotificationConfig[]> {
	const db = await getDatabase();
	return db.getAllAsync<NotificationConfig>(
		'SELECT * FROM notification_config WHERE income_source_id = ?',
		[incomeSourceId],
	);
}

export async function listAllNotificationConfigs(): Promise<
	NotificationConfig[]
> {
	const db = await getDatabase();
	return db.getAllAsync<NotificationConfig>(
		'SELECT * FROM notification_config',
	);
}

export async function updateNotificationConfigs(
	incomeSourceId: number,
	settings: NotificationSettings,
): Promise<void> {
	const db = await getDatabase();
	await db.runAsync(
		`UPDATE notification_config SET enabled = ?, time = ?
		 WHERE income_source_id = ? AND type = 'payday'`,
		[settings.paydayEnabled ? 1 : 0, settings.paydayTime, incomeSourceId],
	);
	await db.runAsync(
		`UPDATE notification_config SET enabled = ?, time = ?
		 WHERE income_source_id = ? AND type = 'budget_reminder'`,
		[
			settings.budgetReminderEnabled ? 1 : 0,
			settings.budgetReminderTime,
			incomeSourceId,
		],
	);
}
