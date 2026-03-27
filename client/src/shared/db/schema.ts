export const createTables = `
  CREATE TABLE IF NOT EXISTS user_preferences (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    currency TEXT NOT NULL DEFAULT 'PHP',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS income_source (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    amount REAL NOT NULL,
    pay_schedule TEXT NOT NULL CHECK (pay_schedule IN ('monthly', 'bi-monthly', 'bi-weekly', 'weekly')),
    pay_dates TEXT NOT NULL,
    pay_amounts TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS category (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_default INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS budget_month (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year_month TEXT NOT NULL UNIQUE,
    created_from_id INTEGER REFERENCES budget_month(id),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS budget_item (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    budget_month_id INTEGER NOT NULL REFERENCES budget_month(id) ON DELETE CASCADE,
    income_source_id INTEGER NOT NULL REFERENCES income_source(id),
    category_id INTEGER NOT NULL REFERENCES category(id),
    name TEXT NOT NULL,
    total_amount REAL NOT NULL,
    split_type TEXT NOT NULL DEFAULT 'even' CHECK (split_type IN ('even', 'custom')),
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS budget_item_allocation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    budget_item_id INTEGER NOT NULL REFERENCES budget_item(id) ON DELETE CASCADE,
    pay_period_index INTEGER NOT NULL,
    amount REAL NOT NULL,
    is_paid INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(budget_item_id, pay_period_index)
  );

  CREATE TABLE IF NOT EXISTS notification_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    income_source_id INTEGER NOT NULL REFERENCES income_source(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('payday', 'budget_reminder')),
    enabled INTEGER NOT NULL DEFAULT 1,
    time TEXT NOT NULL DEFAULT '10:00',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(income_source_id, type)
  );
`;
