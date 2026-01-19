
import { Income, Expense, Category, Budget, AppSettings, CategoryType } from '../types';
import { DEFAULT_CATEGORIES } from '../constants';

const DB_KEYS = {
  INCOME: 'arthasync_income',
  EXPENSE: 'arthasync_expense',
  CATEGORY: 'arthasync_category',
  BUDGET: 'arthasync_budget',
  SETTINGS: 'arthasync_settings',
};

export class LocalDb {
  private static get<T>(key: string, defaultValue: T): T {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  }

  private static set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // --- Transactions ---
  static getIncomes(): Income[] {
    return this.get<Income[]>(DB_KEYS.INCOME, []);
  }

  static addIncome(income: Omit<Income, 'id'>): Income {
    const incomes = this.getIncomes();
    const newIncome = { ...income, id: crypto.randomUUID() };
    this.set(DB_KEYS.INCOME, [...incomes, newIncome]);
    return newIncome;
  }

  static deleteIncome(id: string): void {
    const incomes = this.getIncomes().filter(i => i.id !== id);
    this.set(DB_KEYS.INCOME, incomes);
  }

  static getExpenses(): Expense[] {
    return this.get<Expense[]>(DB_KEYS.EXPENSE, []);
  }

  static addExpense(expense: Omit<Expense, 'id'>): Expense {
    const expenses = this.getExpenses();
    const newExpense = { ...expense, id: crypto.randomUUID() };
    this.set(DB_KEYS.EXPENSE, [...expenses, newExpense]);
    return newExpense;
  }

  static deleteExpense(id: string): void {
    const expenses = this.getExpenses().filter(e => e.id !== id);
    this.set(DB_KEYS.EXPENSE, expenses);
  }

  // --- Categories ---
  static getCategories(): Category[] {
    return this.get<Category[]>(DB_KEYS.CATEGORY, DEFAULT_CATEGORIES);
  }

  static addCategory(category: Omit<Category, 'id'>): Category {
    const categories = this.getCategories();
    const newCategory = { ...category, id: crypto.randomUUID() };
    this.set(DB_KEYS.CATEGORY, [...categories, newCategory]);
    return newCategory;
  }

  static deleteCategory(id: string): void {
    const categories = this.getCategories().filter(c => c.id !== id);
    this.set(DB_KEYS.CATEGORY, categories);
  }

  // --- Budgets ---
  static getBudgets(): Budget[] {
    return this.get<Budget[]>(DB_KEYS.BUDGET, []);
  }

  static setBudget(budget: Omit<Budget, 'id'>): Budget {
    const budgets = this.getBudgets();
    // Unique by category + month
    const existingIdx = budgets.findIndex(b => b.categoryId === budget.categoryId && b.month === budget.month);
    
    if (existingIdx > -1) {
      const updatedBudgets = [...budgets];
      updatedBudgets[existingIdx] = { ...updatedBudgets[existingIdx], amount: budget.amount };
      this.set(DB_KEYS.BUDGET, updatedBudgets);
      return updatedBudgets[existingIdx];
    } else {
      const newBudget = { ...budget, id: crypto.randomUUID() };
      this.set(DB_KEYS.BUDGET, [...budgets, newBudget]);
      return newBudget;
    }
  }

  // --- Settings ---
  static getSettings(): AppSettings {
    return this.get<AppSettings>(DB_KEYS.SETTINGS, {
      language: 'en',
      currency: 'BDT',
      darkMode: false,
      pin: null,
    });
  }

  static updateSettings(settings: Partial<AppSettings>): void {
    const current = this.getSettings();
    this.set(DB_KEYS.SETTINGS, { ...current, ...settings });
  }
}
