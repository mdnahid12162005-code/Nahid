
import React, { useState, useEffect } from 'react';
import { Income, Expense, Category, Budget, AppSettings, CategoryType } from './types';
import { LocalDb } from './database/localDb';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import BudgetView from './components/BudgetView';
import { TRANSLATIONS } from './constants';

const App: React.FC = () => {
  // --- Data State ---
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [settings, setSettings] = useState<AppSettings>(LocalDb.getSettings());

  // --- UI State ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [addingType, setAddingType] = useState<CategoryType | null>(null);
  const [isLocked, setIsLocked] = useState(!!LocalDb.getSettings().pin);
  const [pinInput, setPinInput] = useState('');

  // --- Initial Load ---
  useEffect(() => {
    setIncomes(LocalDb.getIncomes());
    setExpenses(LocalDb.getExpenses());
    setCategories(LocalDb.getCategories());
    setBudgets(LocalDb.getBudgets());
  }, []);

  // --- Actions ---
  const handleAddTransaction = (data: any) => {
    if (addingType === CategoryType.INCOME) {
      const newIncome = LocalDb.addIncome(data);
      setIncomes([...incomes, newIncome]);
    } else if (addingType === CategoryType.EXPENSE) {
      const newExpense = LocalDb.addExpense(data);
      setExpenses([...expenses, newExpense]);
    }
    setAddingType(null);
  };

  const handleDeleteTransaction = (id: string, type: CategoryType) => {
    if (type === CategoryType.INCOME) {
      LocalDb.deleteIncome(id);
      setIncomes(incomes.filter(i => i.id !== id));
    } else {
      LocalDb.deleteExpense(id);
      setExpenses(expenses.filter(e => e.id !== id));
    }
  };

  const handleSetBudget = (budget: Omit<Budget, 'id'>) => {
    LocalDb.setBudget(budget);
    setBudgets(LocalDb.getBudgets());
  };

  const updateSetting = (newSettings: Partial<AppSettings>) => {
    LocalDb.updateSettings(newSettings);
    setSettings(LocalDb.getSettings());
  };

  // --- Security ---
  const handleUnlock = () => {
    if (pinInput === settings.pin) {
      setIsLocked(false);
    } else {
      alert('Incorrect PIN');
      setPinInput('');
    }
  };

  if (isLocked) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 ${settings.darkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-slate-900'}`}>
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center border border-gray-100 dark:border-slate-700">
          <div className="text-5xl mb-6">🔒</div>
          <h2 className="text-2xl font-bold mb-2">ArthaSync</h2>
          <p className="text-gray-500 mb-6 text-sm">{TRANSLATIONS.pinRequired[settings.language]}</p>
          <input 
            type="password"
            maxLength={4}
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
            className="w-full text-center text-2xl tracking-[1em] py-3 rounded-2xl bg-gray-50 dark:bg-slate-900 border-none mb-6 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="••••"
          />
          <button 
            onClick={handleUnlock}
            className="w-full bg-indigo-600 text-white py-3 rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all"
          >
            Unlock
          </button>
        </div>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} lang={settings.language} darkMode={settings.darkMode}>
      {activeTab === 'dashboard' && (
        <Dashboard incomes={incomes} expenses={expenses} categories={categories} lang={settings.language} currency={settings.currency} />
      )}

      {activeTab === 'transactions' && (
        <TransactionList 
          incomes={incomes} 
          expenses={expenses} 
          categories={categories} 
          lang={settings.language} 
          currency={settings.currency} 
          onAddTransaction={setAddingType}
          onDelete={handleDeleteTransaction}
        />
      )}

      {activeTab === 'budgets' && (
        <BudgetView 
          expenses={expenses} 
          categories={categories} 
          budgets={budgets} 
          lang={settings.language} 
          currency={settings.currency} 
          onSetBudget={handleSetBudget} 
        />
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">{TRANSLATIONS.settings[settings.language]}</h2>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">{TRANSLATIONS.language[settings.language]}</p>
                  <p className="text-xs text-gray-400">Application display language</p>
                </div>
                <select 
                  value={settings.language}
                  onChange={(e) => updateSetting({ language: e.target.value as any })}
                  className="bg-gray-50 dark:bg-slate-900 border-none rounded-lg px-4 py-2 outline-none"
                >
                  <option value="en">English</option>
                  <option value="bn">বাংলা (Bengali)</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">{TRANSLATIONS.currency[settings.language]}</p>
                  <p className="text-xs text-gray-400">Local currency symbol</p>
                </div>
                <select 
                  value={settings.currency}
                  onChange={(e) => updateSetting({ currency: e.target.value })}
                  className="bg-gray-50 dark:bg-slate-900 border-none rounded-lg px-4 py-2 outline-none"
                >
                  <option value="BDT">BDT (৳)</option>
                  <option value="USD">USD ($)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">{TRANSLATIONS.darkMode[settings.language]}</p>
                  <p className="text-xs text-gray-400">Switch to dark interface</p>
                </div>
                <button 
                  onClick={() => updateSetting({ darkMode: !settings.darkMode })}
                  className={`w-12 h-6 rounded-full transition-all relative ${settings.darkMode ? 'bg-indigo-600' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.darkMode ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">{TRANSLATIONS.security[settings.language]}</p>
                  <p className="text-xs text-gray-400">App PIN protection (4 digits)</p>
                </div>
                <input 
                  type="password"
                  maxLength={4}
                  placeholder="Set PIN"
                  className="w-24 bg-gray-50 dark:bg-slate-900 border-none rounded-lg px-4 py-2 text-center outline-none"
                  onBlur={(e) => updateSetting({ pin: e.target.value || null })}
                />
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400 text-sm">
            💡 <strong>Note:</strong> All data is stored locally on your device for maximum privacy. Clearing browser storage will delete your financial records.
          </div>
        </div>
      )}

      {addingType && (
        <TransactionForm 
          type={addingType} 
          categories={categories} 
          lang={settings.language} 
          onSave={handleAddTransaction} 
          onCancel={() => setAddingType(null)} 
        />
      )}
    </Layout>
  );
};

export default App;
