CREATE TABLE `budget_item` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`budget_month_id` integer NOT NULL,
	`income_source_id` integer NOT NULL,
	`category_id` integer NOT NULL,
	`name` text NOT NULL,
	`total_amount` real NOT NULL,
	`split_type` text DEFAULT 'even' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`budget_month_id`) REFERENCES `budget_month`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`income_source_id`) REFERENCES `income_source`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `budget_item_allocation` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`budget_item_id` integer NOT NULL,
	`pay_period_index` integer NOT NULL,
	`amount` real NOT NULL,
	`is_paid` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`budget_item_id`) REFERENCES `budget_item`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `budget_item_allocation_unique_idx` ON `budget_item_allocation` (`budget_item_id`,`pay_period_index`);--> statement-breakpoint
CREATE TABLE `budget_month` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`year_month` text NOT NULL,
	`created_from_id` integer,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`created_from_id`) REFERENCES `budget_month`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `budget_month_year_month_idx` ON `budget_month` (`year_month`);--> statement-breakpoint
CREATE TABLE `category` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`is_default` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `income_source` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`amount` real NOT NULL,
	`pay_schedule` text NOT NULL,
	`pay_dates` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_preferences` (
	`id` integer PRIMARY KEY NOT NULL,
	`currency` text DEFAULT 'PHP' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	CONSTRAINT "user_preferences_id_check" CHECK("user_preferences"."id" = 1)
);
