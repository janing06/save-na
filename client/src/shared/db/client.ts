import { defaultCategories } from '@shared/config';
import * as SQLite from 'expo-sqlite';
import { createTables } from './schema';
import { seedDefaultCategories } from './seed';

let db: SQLite.SQLiteDatabase | null = null;

async function runMigrations(database: SQLite.SQLiteDatabase): Promise<void> {
	// Migration 1: add pay_amounts column
	const columns = await database.getAllAsync<{ name: string }>(
		"SELECT name FROM pragma_table_info('income_source')",
	);
	const hasPayAmounts = columns.some((c) => c.name === 'pay_amounts');
	if (!hasPayAmounts) {
		await database.execAsync(
			'ALTER TABLE income_source ADD COLUMN pay_amounts TEXT;',
		);
	}

	// Migration 2: insert default notification configs for existing income sources
	const sources = await database.getAllAsync<{ id: number }>(
		'SELECT id FROM income_source',
	);
	for (const source of sources) {
		await database.runAsync(
			`INSERT OR IGNORE INTO notification_config (income_source_id, type, enabled, time)
			 VALUES (?, 'payday', 1, '10:00')`,
			[source.id],
		);
		await database.runAsync(
			`INSERT OR IGNORE INTO notification_config (income_source_id, type, enabled, time)
			 VALUES (?, 'budget_reminder', 1, '10:00')`,
			[source.id],
		);
	}

	// Migration 3: ensure all default categories exist (restores any that were deleted)
	for (const cat of defaultCategories) {
		const exists = await database.getFirstAsync<{ count: number }>(
			'SELECT COUNT(*) as count FROM category WHERE name = ? AND is_default = 1',
			[cat.name],
		);
		if (!exists || exists.count === 0) {
			await database.runAsync(
				'INSERT INTO category (name, sort_order, is_default) VALUES (?, ?, 1)',
				[cat.name, cat.sort_order],
			);
		}
	}

	// Migration 4: add openrouter_api_key column to user_preferences
	const prefColumns = await database.getAllAsync<{ name: string }>(
		"SELECT name FROM pragma_table_info('user_preferences')",
	);
	const hasApiKey = prefColumns.some((c) => c.name === 'openrouter_api_key');
	if (!hasApiKey) {
		await database.execAsync(
			'ALTER TABLE user_preferences ADD COLUMN openrouter_api_key TEXT;',
		);
	}

	// Migration 5: add app_lock_enabled column to user_preferences
	const hasAppLock = prefColumns.some((c) => c.name === 'app_lock_enabled');
	if (!hasAppLock) {
		await database.execAsync(
			'ALTER TABLE user_preferences ADD COLUMN app_lock_enabled INTEGER NOT NULL DEFAULT 0;',
		);
	}
}

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
	if (db) return db;

	db = await SQLite.openDatabaseAsync('savena.db');

	await db.execAsync('PRAGMA journal_mode = WAL;');
	await db.execAsync('PRAGMA foreign_keys = ON;');
	await db.execAsync(createTables);
	await runMigrations(db);
	await seedDefaultCategories(db);

	return db;
}
