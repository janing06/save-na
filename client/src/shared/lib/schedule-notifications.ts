import {
	listAllNotificationConfigs,
	listBudgetItemsWithDueDay,
	listIncomeSources,
} from '@shared/db';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { getNextPaydays } from './next-paydays';
import type { IncomeSource, NotificationConfig } from './types';

async function getNotifications() {
	// expo-notifications is not supported in Expo Go since SDK 53
	if (Constants.appOwnership === 'expo') return null;
	try {
		return await import('expo-notifications');
	} catch {
		return null;
	}
}

export async function requestNotificationPermission(): Promise<boolean> {
	const Notifications = await getNotifications();
	if (!Notifications) return false;

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
	const Notifications = await getNotifications();
	if (!Notifications) return;

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
	const Notifications = await getNotifications();
	if (!Notifications) return;

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
	const Notifications = await getNotifications();
	if (!Notifications) return;

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

	const itemsWithDueDay = await listBudgetItemsWithDueDay();
	const now2 = new Date();
	const today = new Date(now2.getFullYear(), now2.getMonth(), now2.getDate());

	for (const item of itemsWithDueDay) {
		// Schedule for current month and next month
		for (let monthOffset = 0; monthOffset <= 1; monthOffset++) {
			const daysInMonth = new Date(
				today.getFullYear(),
				today.getMonth() + monthOffset + 1,
				0,
			).getDate();
			const clampedDay = Math.min(item.due_day, daysInMonth);
			const targetDate = new Date(
				today.getFullYear(),
				today.getMonth() + monthOffset,
				clampedDay,
			);
			const notifyDate = new Date(targetDate);
			notifyDate.setDate(notifyDate.getDate() - 1);
			notifyDate.setHours(10, 0, 0, 0);

			if (notifyDate > now2) {
				const dateKey = targetDate.toISOString().split('T')[0];
				await Notifications.scheduleNotificationAsync({
					identifier: `due-date-${item.id}-${dateKey}`,
					content: {
						title: 'Budget item due tomorrow',
						body: `${item.name} (₱${item.total_amount.toLocaleString()}) is due tomorrow.`,
					},
					trigger: {
						type: Notifications.SchedulableTriggerInputTypes.DATE,
						date: notifyDate,
					},
				});
			}
		}
	}
}
