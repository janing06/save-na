export type PaySchedule = 'monthly' | 'bi-monthly' | 'bi-weekly' | 'weekly';
export type SplitType = 'even' | 'custom';

export type UserPreferences = {
	id: number;
	currency: string;
	app_lock_enabled: number;
	created_at: string;
	updated_at: string;
};

export type IncomeSource = {
	id: number;
	name: string;
	amount: number;
	pay_schedule: PaySchedule;
	pay_dates: string; // JSON array of day numbers
	pay_amounts: string | null; // JSON array of amounts per pay day (bi-monthly only)
	sort_order: number;
	created_at: string;
	updated_at: string;
};

export type Category = {
	id: number;
	name: string;
	sort_order: number;
	is_default: number;
	created_at: string;
	updated_at: string;
};

export type BudgetMonth = {
	id: number;
	year_month: string;
	created_from_id: number | null;
	created_at: string;
	updated_at: string;
};

export type BudgetItem = {
	id: number;
	budget_month_id: number;
	income_source_id: number;
	category_id: number;
	name: string;
	total_amount: number;
	split_type: SplitType;
	sort_order: number;
	created_at: string;
	updated_at: string;
};

export type BudgetItemAllocation = {
	id: number;
	budget_item_id: number;
	pay_period_index: number;
	amount: number;
	is_paid: number;
	created_at: string;
	updated_at: string;
};

export type NotificationType = 'payday' | 'budget_reminder';

export type NotificationConfig = {
	id: number;
	income_source_id: number;
	type: NotificationType;
	enabled: number; // 0 or 1
	time: string; // 'HH:MM'
};

export type NotificationSettings = {
	paydayEnabled: boolean;
	paydayTime: string;
	budgetReminderEnabled: boolean;
	budgetReminderTime: string;
};

export type ChatMessage = {
	id: number;
	role: 'user' | 'assistant';
	content: string;
	created_at: string;
};
