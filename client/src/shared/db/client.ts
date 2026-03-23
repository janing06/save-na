import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from './schema';

// DEV-PHASE: use savena_v2.db to start fresh with Drizzle migrations.
// Rename back to savena.db before shipping to production.
const expoDb = SQLite.openDatabaseSync('savena_v2.db');
expoDb.execSync('PRAGMA foreign_keys = ON;');

export const db = drizzle(expoDb, { schema });
