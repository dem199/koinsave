'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { transactionAPI } from '@/lib/api';
import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';

export default function ChartSection() {
  const { user } = useAuth();
  const [period, setPeriod] = useState('month');
  const [data, setData] = useState({
    income: 0,
    expenses: 0,
    savings: 0,
    net: 0,
    categories: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      try {
        const transactions = await transactionAPI.getTransactions(user.id);
        const now = new Date();
        let filtered = [];

        if (period === 'week') {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          filtered = transactions.filter(t => new Date(t.date) >= weekAgo);
        } else if (period === 'month') {
          filtered = transactions.filter(t => {
            const date = new Date(t.date);
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
          });
        } else {
          const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          filtered = transactions.filter(t => new Date(t.date) >= yearAgo);
        }

        const income = filtered.filter(t => t.type === 'receive').reduce((sum, t) => sum + t.amount, 0);
        const expenses = filtered.filter(t => t.type === 'send' || t.type === 'bills').reduce((sum, t) => sum + t.amount, 0);
        const savings = filtered.filter(t => t.type === 'savings').reduce((sum, t) => sum + t.amount, 0);

        const categoryMap = {};
        filtered
          .filter(t => t.type === 'send' || t.type === 'bills')
          .forEach(t => {
            categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
          });

        const categories = Object.entries(categoryMap)
          .map(([name, amount]) => ({ name, amount }))
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 5);

        setData({
          income,
          expenses,
          savings,
          net: income - expenses,
          categories,
        });
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, period]);

  const getCategoryIcon = (name) => {
    const icons = {
      food: '🍔',
      shopping: '🛒',
      housing: '🏠',
      utilities: '⚡',
      transportation: '🚗',
      entertainment: '🎬',
      healthcare: '🏥',
      education: '📚',
      transfer: '💸',
      income: '💰',
      other: '📦',
    };
    return icons[name.toLowerCase()] || '💳';
  };

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totalExpenses = data.expenses;
  const savingsRate = data.income > 0 ? ((data.savings / data.income) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <PieChart size={20} className="text-emerald-600" />
          Financial Overview
        </h2>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        >
          <option value="week">Last 7 Days</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      {/* Summary Cards - Original Gradient Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Income */}
        <div className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium opacity-90">Income</span>
              <TrendingUp size={20} />
            </div>
            <p className="text-3xl font-bold mb-1">${data.income.toFixed(2)}</p>
            <p className="text-xs opacity-75">0 transactions</p>
          </div>
        </div>

        {/* Expenses */}
        <div className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-red-500 to-pink-600 text-white shadow-lg">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium opacity-90">Expenses</span>
              <TrendingDown size={20} />
            </div>
            <p className="text-3xl font-bold mb-1">${data.expenses.toFixed(2)}</p>
            <p className="text-xs opacity-75">{data.expenses > 0 ? '2 transactions' : '0 transactions'}</p>
          </div>
        </div>

        {/* Savings */}
        <div className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium opacity-90">Savings</span>
              <DollarSign size={20} />
            </div>
            <p className="text-3xl font-bold mb-1">${data.savings.toFixed(2)}</p>
            <p className="text-xs opacity-75">{data.savings > 0 ? '1 transaction' : '0 transactions'}</p>
          </div>
        </div>

        {/* Net */}
        <div className={`relative overflow-hidden rounded-xl p-4 bg-gradient-to-br ${data.net >= 0 ? 'from-blue-500 to-cyan-600' : 'from-orange-500 to-red-600'} text-white shadow-lg`}>
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium opacity-90">Net</span>
              <DollarSign size={20} />
            </div>
            <p className="text-3xl font-bold mb-1">
              {data.net >= 0 ? '+' : ''}${data.net.toFixed(2)}
            </p>
            <p className="text-xs opacity-75">{data.net >= 0 ? 'Surplus' : 'Deficit'}</p>
          </div>
        </div>
      </div>

      {/* Top Categories */}
      <div className="card">
        <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <PieChart size={18} className="text-emerald-600" />
          Top Spending Categories
        </h3>
        
        {data.categories.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <PieChart size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">No spending data for this period</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.categories.map((cat, index) => {
              const percentage = totalExpenses > 0 ? (cat.amount / totalExpenses * 100).toFixed(1) : 0;
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 capitalize flex items-center gap-2">
                      <span>{getCategoryIcon(cat.name)}</span>
                      {cat.name}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      ${cat.amount.toFixed(2)} <span className="text-gray-500 dark:text-gray-400">{percentage}%</span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card border-l-4 border-yellow-500">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xl">💡</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Savings Rate</h4>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{savingsRate}%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">of your income goes to savings</p>
            </div>
          </div>
        </div>

        <div className="card border-l-4 border-blue-500">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xl">📊</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Expense Ratio</h4>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {data.income > 0 ? ((data.expenses / data.income) * 100).toFixed(1) : 0}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">of your income goes to expenses</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}