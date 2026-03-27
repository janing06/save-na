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
