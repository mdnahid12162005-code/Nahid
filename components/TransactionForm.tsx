
import React, { useState } from 'react';
import { Category, CategoryType, Language } from '../types';
import { TRANSLATIONS, PAYMENT_METHODS } from '../constants';

interface TransactionFormProps {
  type: CategoryType;
  categories: Category[];
  lang: Language;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ type, categories, lang, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    source: '',
    categoryId: categories.find(c => c.type === type)?.id || '',
    amount: '',
    note: '',
    paymentMethodId: PAYMENT_METHODS[0].id
  });

  const filteredCategories = categories.filter(c => c.type === type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.source) return;
    
    onSave({
      ...formData,
      amount: parseFloat(formData.amount)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className={`p-6 ${type === CategoryType.INCOME ? 'bg-green-600' : 'bg-red-600'} text-white`}>
          <h2 className="text-xl font-bold">{TRANSLATIONS.addTransaction[lang]} ({type === CategoryType.INCOME ? TRANSLATIONS.income[lang] : TRANSLATIONS.expenses[lang]})</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">{TRANSLATIONS.date[lang]}</label>
              <input 
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">{TRANSLATIONS.amount[lang]}</label>
              <input 
                type="number"
                required
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">{type === CategoryType.INCOME ? TRANSLATIONS.source[lang] : TRANSLATIONS.title[lang]}</label>
            <input 
              type="text"
              required
              placeholder={type === CategoryType.INCOME ? "e.g. Monthly Salary" : "e.g. Grocery Shopping"}
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">{TRANSLATIONS.category[lang]}</label>
            <select 
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {filteredCategories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {type === CategoryType.EXPENSE && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">{TRANSLATIONS.paymentMethod[lang]}</label>
              <select 
                value={formData.paymentMethodId}
                onChange={(e) => setFormData({ ...formData, paymentMethodId: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {PAYMENT_METHODS.map(pm => (
                  <option key={pm.id} value={pm.id}>{pm.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">{TRANSLATIONS.note[lang]}</label>
            <textarea 
              rows={2}
              placeholder="Extra details..."
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-100 dark:bg-slate-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
            >
              {TRANSLATIONS.cancel[lang]}
            </button>
            <button 
              type="submit"
              className={`flex-1 px-4 py-2 font-bold rounded-xl text-white shadow-lg transition-all ${type === CategoryType.INCOME ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
            >
              {TRANSLATIONS.save[lang]}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
