
export type Language = 'en' | 'bn';

export enum CategoryType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  icon?: string;
  color?: string;
}

export interface Income {
  id: string;
  date: string;
  source: string;
  categoryId: string;
  amount: number;
  note: string;
}

export interface Expense {
  id: string;
  date: string;
  title: string;
  categoryId: string;
  paymentMethodId: string;
  amount: number;
  note: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  month: string; // YYYY-MM
}

export interface PaymentMethod {
  id: string;
  name: string;
}

export interface AppSettings {
  language: Language;
  currency: string;
  darkMode: boolean;
  pin: string | null;
}

export interface TranslationDict {
  [key: string]: {
    en: string;
    bn: string;
  };
}
