
import { TranslationDict, CategoryType } from './types';

export const TRANSLATIONS: TranslationDict = {
  dashboard: { en: 'Dashboard', bn: 'ড্যাশবোর্ড' },
  income: { en: 'Income', bn: 'আয়' },
  expenses: { en: 'Expenses', bn: 'ব্যয়' },
  categories: { en: 'Categories', bn: 'ক্যাটাগরি' },
  reports: { en: 'Reports', bn: 'রিপোর্ট' },
  budgets: { en: 'Budgets', bn: 'বাজেট' },
  settings: { en: 'Settings', bn: 'সেটিংস' },
  totalBalance: { en: 'Total Balance', bn: 'মোট ব্যালেন্স' },
  totalIncome: { en: 'Total Income', bn: 'মোট আয়' },
  totalExpenses: { en: 'Total Expense', bn: 'মোট ব্যয়' },
  netProfit: { en: 'Net Profit', bn: 'নিট মুনাফা' },
  netLoss: { en: 'Net Loss', bn: 'নিট লোকসান' },
  addTransaction: { en: 'Add Transaction', bn: 'লেনদেন যোগ করুন' },
  recentTransactions: { en: 'Recent Transactions', bn: 'সাম্প্রতিক লেনদেন' },
  monthlyTrend: { en: 'Monthly Trend', bn: 'মাসিক প্রবণতা' },
  expenseBreakdown: { en: 'Expense Breakdown', bn: 'ব্যয় বিশ্লেষণ' },
  language: { en: 'Language', bn: 'ভাষা' },
  currency: { en: 'Currency', bn: 'মুদ্রা' },
  darkMode: { en: 'Dark Mode', bn: 'ডার্ক মোড' },
  amount: { en: 'Amount', bn: 'পরিমাণ' },
  date: { en: 'Date', bn: 'তারিখ' },
  note: { en: 'Note', bn: 'নোট' },
  save: { en: 'Save', bn: 'সংরক্ষণ করুন' },
  cancel: { en: 'Cancel', bn: 'বাতিল করুন' },
  source: { en: 'Source', bn: 'উৎস' },
  title: { en: 'Title', bn: 'শিরোনাম' },
  category: { en: 'Category', bn: 'ক্যাটাগরি' },
  paymentMethod: { en: 'Payment Method', bn: 'পেমেন্ট পদ্ধতি' },
  search: { en: 'Search', bn: 'অনুসন্ধান' },
  noData: { en: 'No data found', bn: 'কোনো তথ্য পাওয়া যায়নি' },
  overBudget: { en: 'Over Budget!', bn: 'বাজেট ছাড়িয়েছে!' },
  underBudget: { en: 'Within Budget', bn: 'বাজেটের মধ্যে' },
  pinRequired: { en: 'Enter PIN to Unlock', bn: 'আনলক করতে পিন লিখুন' },
  security: { en: 'Security', bn: 'নিরাপত্তা' },
};

export const DEFAULT_CATEGORIES = [
  { id: 'inc1', name: 'Salary', type: CategoryType.INCOME, color: '#10b981' },
  { id: 'inc2', name: 'Business', type: CategoryType.INCOME, color: '#3b82f6' },
  { id: 'inc3', name: 'Farm Sales', type: CategoryType.INCOME, color: '#f59e0b' },
  { id: 'exp1', name: 'Food', type: CategoryType.EXPENSE, color: '#ef4444' },
  { id: 'exp2', name: 'Rent', type: CategoryType.EXPENSE, color: '#8b5cf6' },
  { id: 'exp3', name: 'Transport', type: CategoryType.EXPENSE, color: '#ec4899' },
  { id: 'exp4', name: 'Farm Supplies', type: CategoryType.EXPENSE, color: '#d97706' },
];

export const PAYMENT_METHODS = [
  { id: 'pm1', name: 'Cash' },
  { id: 'pm2', name: 'Bank Transfer' },
  { id: 'pm3', name: 'bKash/Mobile Pay' },
  { id: 'pm4', name: 'Credit Card' },
];
