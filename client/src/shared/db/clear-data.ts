import * as Notifications from 'expo-notifications';
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

	await Notifications.cancelAllScheduledNotificationsAsync();
	await seedDefaultCategories(db);
}
