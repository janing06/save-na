import * as SQLite from 'expo-sqlite';
import { createTables } from './schema';
import { seedDefaultCategories } from './seed';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
	if (db) return db;

	db = await SQLite.openDatabaseAsync('savena.db');

	await db.execAsync('PRAGMA journal_mode = WAL;');
	await db.execAsync('PRAGMA foreign_keys = ON;');
	await db.execAsync(createTables);
	await seedDefaultCategories(db);

	return db;
}
