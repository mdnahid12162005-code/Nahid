
import { GoogleGenAI } from "@google/genai";
import { Income, Expense, Category } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function getFinancialAdvice(
  incomes: Income[], 
  expenses: Expense[], 
  categories: Category[],
  language: 'en' | 'bn' = 'en'
): Promise<string> {
  if (!process.env.API_KEY) return language === 'en' ? "AI insights disabled (API key missing)." : "AI অন্তর্দৃষ্টি নিষ্ক্রিয় (API কী নেই)।";

  const summary = {
    totalIncome: incomes.reduce((sum, i) => sum + i.amount, 0),
    totalExpense: expenses.reduce((sum, e) => sum + e.amount, 0),
    expenseByCategory: categories
      .filter(c => c.type === 'EXPENSE')
      .map(c => {
        const amount = expenses.filter(e => e.categoryId === c.id).reduce((s, e) => s + e.amount, 0);
        return { name: c.name, amount };
      })
      .filter(c => c.amount > 0)
  };

  const prompt = `
    Context: Financial summary of a user.
    Language: ${language === 'bn' ? 'Bengali' : 'English'}.
    Total Income: ${summary.totalIncome}
    Total Expense: ${summary.totalExpense}
    Top Expenses: ${summary.expenseByCategory.map(e => `${e.name}: ${e.amount}`).join(', ')}

    Analyze this data and provide 3-4 short, actionable pieces of advice for the user to improve their financial health or save money. Be friendly and concise.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a senior financial advisor who helps individuals and small business owners manage their money better. You provide simple, encouraging, and highly practical advice based on income/expense trends."
      }
    });
    return response.text || (language === 'en' ? "Could not generate advice." : "উপদেশ তৈরি করা যায়নি।");
  } catch (error) {
    console.error("Gemini Error:", error);
    return language === 'en' ? "Financial insights unavailable right now." : "আর্থিক অন্তর্দৃষ্টি এই মুহূর্তে উপলব্ধ নয়।";
  }
}
