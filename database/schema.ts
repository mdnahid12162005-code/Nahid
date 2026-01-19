
/**
 * SQLite Database Schema
 * For native implementation (e.g. mobile apps or desktop electron apps)
 */

export const SQLITE_SCHEMA = `
-- Table: Categories
CREATE TABLE categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT CHECK(type IN ('INCOME', 'EXPENSE')) NOT NULL,
    icon TEXT,
    color TEXT
);

-- Table: Incomes
CREATE TABLE income (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    income_source TEXT NOT NULL,
    category_id TEXT,
    amount REAL NOT NULL,
    note TEXT,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Table: Expenses
CREATE TABLE expenses (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    expense_title TEXT NOT NULL,
    category_id TEXT,
    payment_method_id TEXT,
    amount REAL NOT NULL,
    note TEXT,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Table: Budgets
CREATE TABLE budgets (
    id TEXT PRIMARY KEY,
    category_id TEXT NOT NULL,
    amount REAL NOT NULL,
    month TEXT NOT NULL, -- Format: YYYY-MM
    UNIQUE(category_id, month),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Indexes for performance
CREATE INDEX idx_income_date ON income(date);
CREATE INDEX idx_expense_date ON expenses(date);
CREATE INDEX idx_income_category ON income(category_id);
CREATE INDEX idx_expense_category ON expenses(category_id);
`;

export const ER_EXPLANATION = `
Entity Relationship Explanation:
1. One Category can have Many Income records (1:N).
2. One Category can have Many Expense records (1:N).
3. One Category can have Many Budgets (one for each month) (1:N).
4. Income and Expense records are linked to Categories for reporting and budgeting purposes.
`;
