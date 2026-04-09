import { rescheduleAllNotifications } from '@shared/lib';
import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import type * as SQLite from 'expo-sqlite';
import { getDatabase } from './client';

// Must match the number of migrations in src/shared/db/client.ts
export const CURRENT_SCHEMA_VERSION = 6;

type BackupData = {
	version: number;
	exportedAt: string;
	data: {
		user_preferences: Record<string, unknown>[];
		income_sources: Record<string, unknown>[];
		categories: Record<string, unknown>[];
		budget_months: Record<string, unknown>[];
		budget_items: Record<string, unknown>[];
		budget_item_allocations: Record<string, unknown>[];
		notification_configs: Record<string, unknown>[];
	};
};

export async function exportBackup(): Promise<void> {
	const db = await getDatabase();

	const userPreferences = (await db.getAllAsync(
		'SELECT * FROM user_preferences',
	)) as Record<string, unknown>[];
	const incomeSources = (await db.getAllAsync(
		'SELECT * FROM income_source ORDER BY id',
	)) as Record<string, unknown>[];
	const categories = (await db.getAllAsync(
		'SELECT * FROM category ORDER BY id',
	)) as Record<string, unknown>[];
	const budgetMonths = (await db.getAllAsync(
		'SELECT * FROM budget_month ORDER BY id',
	)) as Record<string, unknown>[];
	const budgetItems = (await db.getAllAsync(
		'SELECT * FROM budget_item ORDER BY id',
	)) as Record<string, unknown>[];
	const budgetItemAllocations = (await db.getAllAsync(
		'SELECT * FROM budget_item_allocation ORDER BY id',
	)) as Record<string, unknown>[];
	const notificationConfigs = (await db.getAllAsync(
		'SELECT * FROM notification_config ORDER BY id',
	)) as Record<string, unknown>[];

	const backup: BackupData = {
		version: CURRENT_SCHEMA_VERSION,
		exportedAt: new Date().toISOString(),
		data: {
			user_preferences: userPreferences,
			income_sources: incomeSources,
			categories: categories,
			budget_months: budgetMonths,
			budget_items: budgetItems,
			budget_item_allocations: budgetItemAllocations,
			notification_configs: notificationConfigs,
		},
	};

	const dateStr = new Date().toISOString().split('T')[0];
	const fileName = `savena-backup-${dateStr}.json`;
	const file = new File(Paths.document, fileName);

	file.write(JSON.stringify(backup));
	await Sharing.shareAsync(file.uri, {
		mimeType: 'application/json',
		dialogTitle: 'Export SaveNa Backup',
		UTI: 'public.json',
	});
	file.delete();
}

export type RestoreResult =
	| { status: 'success' }
	| { status: 'cancelled' }
	| { status: 'invalid' }
	| { status: 'newer_version' };

export async function restoreBackup(): Promise<RestoreResult> {
	const result = await DocumentPicker.getDocumentAsync({
		type: 'application/json',
		copyToCacheDirectory: true,
	});

	if (result.canceled) return { status: 'cancelled' };

	const fileUri = result.assets[0].uri;
	let backup: BackupData;

	try {
		const file = new File(fileUri);
		const content = await file.text();
		backup = JSON.parse(content);
	} catch {
		return { status: 'invalid' };
	}

	if (
		typeof backup?.version !== 'number' ||
		typeof backup?.data !== 'object' ||
		backup.data === null
	) {
		return { status: 'invalid' };
	}

	if (backup.version > CURRENT_SCHEMA_VERSION) {
		return { status: 'newer_version' };
	}

	const db = await getDatabase();

	await db.withTransactionAsync(async () => {
		// Delete child-first
		await db.runAsync('DELETE FROM notification_config');
		await db.runAsync('DELETE FROM budget_item_allocation');
		await db.runAsync('DELETE FROM budget_item');
		await db.runAsync('DELETE FROM budget_month');
		await db.runAsync('DELETE FROM income_source');
		await db.runAsync('DELETE FROM category');
		await db.runAsync('DELETE FROM user_preferences');

		// Insert parent-first
		for (const row of backup.data.user_preferences ?? []) {
			await insertRow(db, 'user_preferences', row);
		}
		for (const row of backup.data.income_sources ?? []) {
			await insertRow(db, 'income_source', row);
		}
		for (const row of backup.data.categories ?? []) {
			await insertRow(db, 'category', row);
		}
		for (const row of backup.data.budget_months ?? []) {
			await insertRow(db, 'budget_month', row);
		}
		for (const row of backup.data.budget_items ?? []) {
			await insertRow(db, 'budget_item', row);
		}
		for (const row of backup.data.budget_item_allocations ?? []) {
			await insertRow(db, 'budget_item_allocation', row);
		}
		for (const row of backup.data.notification_configs ?? []) {
			await insertRow(db, 'notification_config', row);
		}
	});

	await rescheduleAllNotifications();

	return { status: 'success' };
}

async function insertRow(
	db: SQLite.SQLiteDatabase,
	table: string,
	row: Record<string, unknown>,
): Promise<void> {
	const tableColumns = await db.getAllAsync<{ name: string }>(
		`SELECT name FROM pragma_table_info('${table}')`,
	);
	const validColumns = new Set(tableColumns.map((c) => c.name));

	const columns = Object.keys(row).filter((col) => validColumns.has(col));
	const placeholders = columns.map(() => '?').join(', ');
	const values = columns.map((col) => row[col]);

	await db.runAsync(
		`INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`,
		values as (string | number | null)[],
	);
}
