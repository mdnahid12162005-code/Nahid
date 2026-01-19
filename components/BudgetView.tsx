
import React, { useState, useMemo } from 'react';
import { Category, Expense, Budget, Language, CategoryType } from '../types';
import { TRANSLATIONS } from '../constants';
import { formatCurrency, getCurrentMonth, getMonthName } from '../utils/formatters';

interface BudgetViewProps {
  expenses: Expense[];
  categories: Category[];
  budgets: Budget[];
  lang: Language;
  currency: string;
  onSetBudget: (budget: Omit<Budget, 'id'>) => void;
}

const BudgetView: React.FC<BudgetViewProps> = ({ expenses, categories, budgets, lang, currency, onSetBudget }) => {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [editingBudget, setEditingBudget] = useState<{ categoryId: string, amount: string } | null>(null);

  const budgetStats = useMemo(() => {
    return categories
      .filter(c => c.type === CategoryType.EXPENSE)
      .map(cat => {
        const budget = budgets.find(b => b.categoryId === cat.id && b.month === selectedMonth)?.amount || 0;
        const spent = expenses
          .filter(e => e.categoryId === cat.id && e.date.startsWith(selectedMonth))
          .reduce((sum, e) => sum + e.amount, 0);
        const percent = budget > 0 ? (spent / budget) * 100 : 0;
        return { cat, budget, spent, percent };
      });
  }, [expenses, categories, budgets, selectedMonth]);

  const handleSaveBudget = () => {
    if (editingBudget) {
      onSetBudget({
        categoryId: editingBudget.categoryId,
        amount: parseFloat(editingBudget.amount) || 0,
        month: selectedMonth
      });
      setEditingBudget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">{TRANSLATIONS.budgets[lang]}</h2>
        <input 
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-slate-800 border-none rounded-xl text-sm shadow-sm outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgetStats.map(({ cat, budget, spent, percent }) => (
          <div key={cat.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: cat.color }}>
                  {cat.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold">{cat.name}</h4>
                  <p className="text-xs text-gray-500">{getMonthName(selectedMonth, lang)}</p>
                </div>
              </div>
              <button 
                onClick={() => setEditingBudget({ categoryId: cat.id, amount: budget.toString() })}
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                ✏️ Edit
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{TRANSLATIONS.totalExpenses[lang]}</span>
                <span className="font-bold">{formatCurrency(spent, currency, lang)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{TRANSLATIONS.budgets[lang]}</span>
                <span className="font-bold">{formatCurrency(budget, currency, lang)}</span>
              </div>
              
              <div className="w-full bg-gray-100 dark:bg-slate-900 rounded-full h-2 mt-4 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${percent > 100 ? 'bg-red-500' : 'bg-indigo-500'}`}
                  style={{ width: `${Math.min(percent, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${percent > 100 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                  {percent > 100 ? TRANSLATIONS.overBudget[lang] : TRANSLATIONS.underBudget[lang]}
                </span>
                <span className="text-xs font-medium text-gray-400">{percent.toFixed(0)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingBudget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold mb-4">Set Monthly Budget</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">AMOUNT</label>
                <input 
                  type="number"
                  autoFocus
                  value={editingBudget.amount}
                  onChange={(e) => setEditingBudget({ ...editingBudget, amount: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditingBudget(null)} className="flex-1 py-2 bg-gray-100 dark:bg-slate-700 rounded-xl font-bold">Cancel</button>
                <button onClick={handleSaveBudget} className="flex-1 py-2 bg-indigo-600 text-white rounded-xl font-bold">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetView;
