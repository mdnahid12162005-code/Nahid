
import { Language } from '../types';

export const formatCurrency = (amount: number, currency: string = 'BDT', lang: Language = 'en'): string => {
  const formatter = new Intl.NumberFormat(lang === 'bn' ? 'bn-BD' : 'en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  });
  return formatter.format(amount);
};

export const formatDate = (dateStr: string, lang: Language = 'en'): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getCurrentMonth = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export const getMonthName = (monthStr: string, lang: Language = 'en'): string => {
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US', { month: 'long', year: 'numeric' });
};
