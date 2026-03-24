import * as SQLite from 'expo-sqlite';
import { createTables } from './schema';
import { seedDefaultCategories } from './seed';

let db: SQLite.SQLiteDatabase | null = null;

async function runMigrations(database: SQLite.SQLiteDatabase): Promise<void> {
	const columns = await database.getAllAsync<{ name: string }>(
		"SELECT name FROM pragma_table_info('income_source')",
	);
	const hasPayAmounts = columns.some((c) => c.name === 'pay_amounts');
	if (!hasPayAmounts) {
		await database.execAsync(
			'ALTER TABLE income_source ADD COLUMN pay_amounts TEXT;',
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
