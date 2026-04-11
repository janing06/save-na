import { getDatabase } from './client';
import { seedDefaultCategories } from './seed';

export async function clearAllData(): Promise<void> {
	const db = await getDatabase();

	await db.withTransactionAsync(async () => {
		await db.runAsync('DELETE FROM notification_config');
		await db.runAsync('DELETE FROM budget_item_allocation');
		await db.runAsync('DELETE FROM budget_item');
		await db.runAsync('DELETE FROM budget_month');
		await db.runAsync('DELETE FROM income_source');
		await db.runAsync('DELETE FROM category');
		await db.runAsync('DELETE FROM user_preferences');
	});

	// expo-notifications is not supported in Expo Go since SDK 53
	const Constants = (await import('expo-constants')).default;
	if (Constants.executionEnvironment !== 'storeClient') {
		try {
			const Notifications = await import('expo-notifications');
			await Notifications.cancelAllScheduledNotificationsAsync();
		} catch {}
	}

	await seedDefaultCategories(db);
}
