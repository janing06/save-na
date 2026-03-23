import { eq, sql } from 'drizzle-orm';
import { db } from '@shared/db';
import { userPreferences } from '@shared/db';

export const updateCurrency = async (currency: string): Promise<void> => {
	await db
		.update(userPreferences)
		.set({ currency, updated_at: sql`(datetime('now'))` })
		.where(eq(userPreferences.id, 1));
};
