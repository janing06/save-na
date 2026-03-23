import { InferSelectModel, sql } from 'drizzle-orm';
import {
	type AnySQLiteColumn,
	check,
	integer,
	real,
	sqliteTable,
	text,
	uniqueIndex,
} from 'drizzle-orm/sqlite-core';

export const userPreferences = sqliteTable(
	'user_preferences',
	{
		id: integer('id').primaryKey(),
		currency: text('currency').notNull().default('PHP'),
		created_at: text('created_at')
			.notNull()
			.default(sql`(datetime('now'))`),
		updated_at: text('updated_at')
			.notNull()
			.default(sql`(datetime('now'))`),
	},
	(t) => [check('user_preferences_id_check', sql`${t.id} = 1`)],
);

export const incomeSource = sqliteTable('income_source', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	amount: real('amount').notNull(),
	pay_schedule: text('pay_schedule', {
		enum: ['monthly', 'bi-monthly', 'bi-weekly', 'weekly'],
	}).notNull(),
	pay_dates: text('pay_dates').notNull(),
	sort_order: integer('sort_order').notNull().default(0),
	created_at: text('created_at')
		.notNull()
		.default(sql`(datetime('now'))`),
	updated_at: text('updated_at')
		.notNull()
		.default(sql`(datetime('now'))`),
});

export const category = sqliteTable('category', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	sort_order: integer('sort_order').notNull().default(0),
	is_default: integer('is_default').notNull().default(0),
	created_at: text('created_at')
		.notNull()
		.default(sql`(datetime('now'))`),
	updated_at: text('updated_at')
		.notNull()
		.default(sql`(datetime('now'))`),
});

export const budgetMonth = sqliteTable(
	'budget_month',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		year_month: text('year_month').notNull(),
		created_from_id: integer('created_from_id').references(
			(): AnySQLiteColumn => budgetMonth.id,
		),
		created_at: text('created_at')
			.notNull()
			.default(sql`(datetime('now'))`),
		updated_at: text('updated_at')
			.notNull()
			.default(sql`(datetime('now'))`),
	},
	(t) => [uniqueIndex('budget_month_year_month_idx').on(t.year_month)],
);

export const budgetItem = sqliteTable('budget_item', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	budget_month_id: integer('budget_month_id')
		.notNull()
		.references(() => budgetMonth.id, { onDelete: 'cascade' }),
	income_source_id: integer('income_source_id')
		.notNull()
		.references(() => incomeSource.id),
	category_id: integer('category_id')
		.notNull()
		.references(() => category.id),
	name: text('name').notNull(),
	total_amount: real('total_amount').notNull(),
	split_type: text('split_type', { enum: ['even', 'custom'] })
		.notNull()
		.default('even'),
	sort_order: integer('sort_order').notNull().default(0),
	created_at: text('created_at')
		.notNull()
		.default(sql`(datetime('now'))`),
	updated_at: text('updated_at')
		.notNull()
		.default(sql`(datetime('now'))`),
});

export const budgetItemAllocation = sqliteTable(
	'budget_item_allocation',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		budget_item_id: integer('budget_item_id')
			.notNull()
			.references(() => budgetItem.id, { onDelete: 'cascade' }),
		pay_period_index: integer('pay_period_index').notNull(),
		amount: real('amount').notNull(),
		is_paid: integer('is_paid').notNull().default(0),
		created_at: text('created_at')
			.notNull()
			.default(sql`(datetime('now'))`),
		updated_at: text('updated_at')
			.notNull()
			.default(sql`(datetime('now'))`),
	},
	(t) => [
		uniqueIndex('budget_item_allocation_unique_idx').on(
			t.budget_item_id,
			t.pay_period_index,
		),
	],
);

// Inferred types — match existing hand-written types in types.ts
export type UserPreferences = InferSelectModel<typeof userPreferences>;
export type IncomeSource = InferSelectModel<typeof incomeSource>;
export type Category = InferSelectModel<typeof category>;
export type BudgetMonth = InferSelectModel<typeof budgetMonth>;
export type BudgetItem = InferSelectModel<typeof budgetItem>;
export type BudgetItemAllocation = InferSelectModel<typeof budgetItemAllocation>;

// Kept as explicit type — cannot be inferred (JOIN + nested array)
export type PaySchedule = 'monthly' | 'bi-monthly' | 'bi-weekly' | 'weekly';
export type SplitType = 'even' | 'custom';
