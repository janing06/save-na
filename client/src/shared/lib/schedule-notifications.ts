import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { listAllNotificationConfigs, listIncomeSources } from '@shared/db';
import type { IncomeSource, NotificationConfig } from './types';
import { getNextPaydays } from './next-paydays';

export async function requestNotificationPermission(): Promise<boolean> {
	if (Platform.OS === 'android') {
		await Notifications.setNotificationChannelAsync('default', {
			name: 'Default',
			importance: Notifications.AndroidImportance.DEFAULT,
		});
	}
	const { status } = await Notifications.requestPermissionsAsync();
	return status === 'granted';
}

export async function cancelNotificationsForSource(
	sourceId: number,
): Promise<void> {
	const scheduled = await Notifications.getAllScheduledNotificationsAsync();
	const toCancel = scheduled.filter(
		(n) =>
			n.identifier.startsWith(`payday-${sourceId}-`) ||
			n.identifier.startsWith(`budget-reminder-${sourceId}-`),
	);
	await Promise.allSettled(
		toCancel.map((n) =>
			Notifications.cancelScheduledNotificationAsync(n.identifier),
		),
	);
}

async function scheduleNotificationsForSource(
	source: IncomeSource,
	configs: NotificationConfig[],
): Promise<void> {
	const paydayConfig = configs.find((c) => c.type === 'payday');
	const reminderConfig = configs.find((c) => c.type === 'budget_reminder');

	const nextPaydays = getNextPaydays(source, 4);
	const now = new Date();

	for (const payday of nextPaydays) {
		const dateKey = payday.toISOString().split('T')[0];

		if (paydayConfig?.enabled === 1) {
			const [hourStr = '10', minuteStr = '00'] = paydayConfig.time.split(':');
			const hour = Number(hourStr);
			const minute = Number(minuteStr);
			const safeHour = Number.isNaN(hour) ? 10 : hour;
			const safeMinute = Number.isNaN(minute) ? 0 : minute;
			const triggerDate = new Date(payday);
			triggerDate.setHours(safeHour, safeMinute, 0, 0);

			if (triggerDate > now) {
				await Notifications.scheduleNotificationAsync({
					identifier: `payday-${source.id}-${dateKey}`,
					content: {
						title: 'Payday! 🎉',
						body: `Your ${source.name} pay is today.`,
					},
					trigger: {
						type: Notifications.SchedulableTriggerInputTypes.DATE,
						date: triggerDate,
					},
				});
			}
		}

		if (reminderConfig?.enabled === 1) {
			const [hourStr = '10', minuteStr = '00'] = reminderConfig.time.split(':');
			const hour = Number(hourStr);
			const minute = Number(minuteStr);
			const safeHour = Number.isNaN(hour) ? 10 : hour;
			const safeMinute = Number.isNaN(minute) ? 0 : minute;
			const reminderDate = new Date(payday);
			reminderDate.setDate(reminderDate.getDate() + 2);
			reminderDate.setHours(safeHour, safeMinute, 0, 0);

			if (reminderDate > now) {
				await Notifications.scheduleNotificationAsync({
					identifier: `budget-reminder-${source.id}-${dateKey}`,
					content: {
						title: 'Budget Reminder',
						body: `You have unchecked budget items from your ${source.name} payday.`,
					},
					trigger: {
						type: Notifications.SchedulableTriggerInputTypes.DATE,
						date: reminderDate,
					},
				});
			}
		}
	}
}

export async function rescheduleAllNotifications(): Promise<void> {
	const hasPermission = await Notifications.getPermissionsAsync().then(
		({ status }) => status === 'granted',
	);
	if (!hasPermission) return;

	if (Platform.OS === 'android') {
		await Notifications.setNotificationChannelAsync('default', {
			name: 'Default',
			importance: Notifications.AndroidImportance.DEFAULT,
		});
	}

	await Notifications.cancelAllScheduledNotificationsAsync();

	const sources = await listIncomeSources();
	const allConfigs = await listAllNotificationConfigs();

	for (const source of sources) {
		const configs = allConfigs.filter((c) => c.income_source_id === source.id);
		await scheduleNotificationsForSource(source, configs);
	}
}
