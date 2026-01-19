
import React, { useState, useMemo } from 'react';
import { Income, Expense, Category, Language, CategoryType } from '../types';
import { TRANSLATIONS } from '../constants';
import { formatCurrency, formatDate } from '../utils/formatters';

interface TransactionListProps {
  incomes: Income[];
  expenses: Expense[];
  categories: Category[];
  lang: Language;
  currency: string;
  onAddTransaction: (type: CategoryType) => void;
  onDelete: (id: string, type: CategoryType) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ incomes, expenses, categories, lang, currency, onAddTransaction, onDelete }) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');

  const allTransactions = useMemo(() => {
    const list = [
      ...incomes.map(i => ({ ...i, type: CategoryType.INCOME })),
      ...expenses.map(e => ({ ...e, type: CategoryType.EXPENSE, source: e.title })),
    ].sort((a, b) => b.date.localeCompare(a.date));

    return list.filter(t => {
      const matchesSearch = t.source.toLowerCase().includes(search.toLowerCase()) || 
                            t.note.toLowerCase().includes(search.toLowerCase()) ||
                            t.amount.toString().includes(search);
      const matchesType = filterType === 'ALL' || t.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [incomes, expenses, search, filterType]);

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'Unknown';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">{TRANSLATIONS.recentTransactions[lang]}</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => onAddTransaction(CategoryType.INCOME)}
            className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition-colors font-medium text-sm"
          >
            + {TRANSLATIONS.income[lang]}
          </button>
          <button 
            onClick={() => onAddTransaction(CategoryType.EXPENSE)}
            className="flex-1 md:flex-none bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-colors font-medium text-sm"
          >
            + {TRANSLATIONS.expenses[lang]}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">🔍</span>
            <input 
              type="text"
              placeholder={TRANSLATIONS.search[lang]}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
            />
          </div>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-2 bg-gray-50 dark:bg-slate-900 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Types</option>
            <option value="INCOME">Income Only</option>
            <option value="EXPENSE">Expense Only</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-slate-900 text-xs text-gray-500 uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">{TRANSLATIONS.date[lang]}</th>
                <th className="px-6 py-4">{TRANSLATIONS.title[lang]}</th>
                <th className="px-6 py-4">{TRANSLATIONS.category[lang]}</th>
                <th className="px-6 py-4 text-right">{TRANSLATIONS.amount[lang]}</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {allTransactions.length > 0 ? allTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 text-sm">{formatDate(t.date, lang)}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium">{t.source}</p>
                    {t.note && <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]">{t.note}</p>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                      t.type === CategoryType.INCOME 
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/20' 
                        : 'bg-red-100 text-red-600 dark:bg-red-900/20'
                    }`}>
                      {getCategoryName(t.categoryId)}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right text-sm font-bold ${t.type === CategoryType.INCOME ? 'text-green-600' : 'text-red-600'}`}>
                    {t.type === CategoryType.INCOME ? '+' : '-'} {formatCurrency(t.amount, currency, lang)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => onDelete(t.id, t.type)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400 italic">
                    {TRANSLATIONS.noData[lang]}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
