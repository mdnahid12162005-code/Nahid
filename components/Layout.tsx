
import React from 'react';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';

interface LayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: Language;
  children: React.ReactNode;
  darkMode: boolean;
}

const Layout: React.FC<LayoutProps> = ({ activeTab, setActiveTab, lang, children, darkMode }) => {
  const navItems = [
    { id: 'dashboard', label: TRANSLATIONS.dashboard[lang], icon: '📊' },
    { id: 'transactions', label: TRANSLATIONS.recentTransactions[lang], icon: '💸' },
    { id: 'budgets', label: TRANSLATIONS.budgets[lang], icon: '🎯' },
    { id: 'reports', label: TRANSLATIONS.reports[lang], icon: '📈' },
    { id: 'settings', label: TRANSLATIONS.settings[lang], icon: '⚙️' },
  ];

  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${darkMode ? 'dark text-white' : 'text-slate-900'}`}>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-50">
        <h1 className="text-xl font-bold text-indigo-600">ArthaSync</h1>
        <button onClick={() => setActiveTab('transactions')} className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          +
        </button>
      </div>

      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 h-screen sticky top-0 p-6">
        <h1 className="text-2xl font-bold text-indigo-600 mb-10 px-2">ArthaSync</h1>
        <nav className="flex-1 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                activeTab === item.id 
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 font-semibold' 
                  : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-slate-700'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 bg-gray-50 dark:bg-slate-900 overflow-y-auto">
        <div className="max-w-6xl mx-auto pb-24 md:pb-0">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 flex justify-around p-2 z-50">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center p-2 rounded-lg ${
              activeTab === item.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
