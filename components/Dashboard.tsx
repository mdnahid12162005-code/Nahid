
import React, { useMemo, useEffect, useState } from 'react';
import { Income, Expense, Category, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { formatCurrency } from '../utils/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { getFinancialAdvice } from '../services/gemini';

interface DashboardProps {
  incomes: Income[];
  expenses: Expense[];
  categories: Category[];
  lang: Language;
  currency: string;
}

const Dashboard: React.FC<DashboardProps> = ({ incomes, expenses, categories, lang, currency }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const stats = useMemo(() => {
    const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
    const balance = totalIncome - totalExpense;
    
    // Monthly data
    const monthlyMap: Record<string, { month: string, income: number, expense: number }> = {};
    [...incomes, ...expenses].forEach(item => {
      const month = item.date.substring(0, 7);
      if (!monthlyMap[month]) monthlyMap[month] = { month, income: 0, expense: 0 };
      if ('source' in item) monthlyMap[month].income += item.amount;
      else monthlyMap[month].expense += item.amount;
    });

    const chartData = Object.values(monthlyMap).sort((a, b) => a.month.localeCompare(b.month)).slice(-6);

    // Pie data
    const pieData = categories
      .filter(c => c.type === 'EXPENSE')
      .map(c => ({
        name: c.name,
        value: expenses.filter(e => e.categoryId === c.id).reduce((s, e) => s + e.amount, 0),
        color: c.color
      }))
      .filter(p => p.value > 0);

    return { totalIncome, totalExpense, balance, chartData, pieData };
  }, [incomes, expenses, categories]);

  useEffect(() => {
    const fetchAdvice = async () => {
      setLoadingAdvice(true);
      const res = await getFinancialAdvice(incomes, expenses, categories, lang);
      setAdvice(res);
      setLoadingAdvice(false);
    };
    if (incomes.length > 0 || expenses.length > 0) {
      fetchAdvice();
    }
  }, [incomes, expenses, categories, lang]);

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{TRANSLATIONS.dashboard[lang]}</h2>
          <p className="text-gray-500 dark:text-gray-400">{TRANSLATIONS.totalBalance[lang]}: <span className={`font-bold ${stats.balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>{formatCurrency(stats.balance, currency, lang)}</span></p>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg text-lg">💰</span>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{TRANSLATIONS.totalIncome[lang]}</p>
          </div>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalIncome, currency, lang)}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg text-lg">💸</span>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{TRANSLATIONS.totalExpenses[lang]}</p>
          </div>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalExpense, currency, lang)}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-lg text-lg">📈</span>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stats.balance >= 0 ? TRANSLATIONS.netProfit[lang] : TRANSLATIONS.netLoss[lang]}</p>
          </div>
          <p className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>
            {formatCurrency(Math.abs(stats.balance), currency, lang)}
          </p>
        </div>
      </div>

      {/* AI Advice Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg overflow-hidden relative">
        <div className="relative z-10">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
            ✨ AI Financial Insight
          </h3>
          {loadingAdvice ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              <p className="text-sm opacity-90">Analyzing your spending habits...</p>
            </div>
          ) : (
            <div className="text-sm whitespace-pre-wrap leading-relaxed opacity-95">
              {advice || "Start adding transactions to get personalized financial advice!"}
            </div>
          )}
        </div>
        <div className="absolute -right-4 -bottom-4 text-8xl opacity-10">🧠</div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
          <h3 className="text-lg font-bold mb-6">{TRANSLATIONS.monthlyTrend[lang]}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
          <h3 className="text-lg font-bold mb-6">{TRANSLATIONS.expenseBreakdown[lang]}</h3>
          <div className="h-64">
            {stats.pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                {TRANSLATIONS.noData[lang]}
              </div>
            )}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {stats.pieData.map((p, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }}></div>
                <span className="truncate">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
