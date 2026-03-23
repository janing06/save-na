import { sql } from 'drizzle-orm';
import { db } from '@shared/db';
import { userPreferences } from '@shared/db';

export const completeOnboarding = async (currency: string): Promise<void> => {
	await db
		.insert(userPreferences)
		.values({ id: 1, currency })
		.onConflictDoUpdate({
			target: userPreferences.id,
			set: { currency, updated_at: sql`(datetime('now'))` },
		});
};
