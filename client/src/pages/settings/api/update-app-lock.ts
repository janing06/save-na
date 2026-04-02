import { getDatabase } from '@shared/db';

export async function updateAppLock(enabled: boolean): Promise<void> {
	const db = await getDatabase();
	await db.runAsync(
		`UPDATE user_preferences SET app_lock_enabled = ?, updated_at = datetime('now') WHERE id = 1`,
		[enabled ? 1 : 0],
	);
}
