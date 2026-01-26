'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { transactionAPI } from '@/lib/api';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart as PieChartIcon,
  BarChart3 
} from 'lucide-react';

const ChartSection = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    const fetchTransactions = async () => {
      if (user?.id) {
        try {
          const data = await transactionAPI.getTransactions(user.id);
          setTransactions(data);
        } catch (error) {
          console.error('Failed to fetch transactions:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTransactions();
  }, [user]);

  // Calculate statistics
  const calculateStats = () => {
    const now = new Date();
    let startDate;

    switch (selectedPeriod) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    const periodTransactions = transactions.filter(
      (txn) => new Date(txn.date) >= startDate
    );

    const income = periodTransactions
      .filter((txn) => txn.type === 'receive')
      .reduce((sum, txn) => sum + txn.amount, 0);

    const expenses = periodTransactions
      .filter((txn) => ['send', 'bills'].includes(txn.type))
      .reduce((sum, txn) => sum + txn.amount, 0);

    const savings = periodTransactions
      .filter((txn) => txn.type === 'savings')
      .reduce((sum, txn) => sum + txn.amount, 0);

    // Category breakdown
    const categoryData = {};
    periodTransactions
      .filter((txn) => ['send', 'bills'].includes(txn.type))
      .forEach((txn) => {
        categoryData[txn.category] = (categoryData[txn.category] || 0) + txn.amount;
      });

    const topCategories = Object.entries(categoryData)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return { income, expenses, savings, topCategories, periodTransactions };
  };

  const stats = calculateStats();
  const netIncome = stats.income - stats.expenses;

  const periods = [
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last Month' },
    { value: 'year', label: 'Last Year' },
  ];

  const getCategoryColor = (index) => {
    const colors = [
      'bg-emerald-500',
      'bg-blue-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-orange-500',
    ];
    return colors[index % colors.length];
  };

  const getCategoryIcon = (category) => {
    const icons = {
      housing: '🏠',
      utilities: '⚡',
      food: '🍔',
      shopping: '🛍️',
      entertainment: '🎬',
      transportation: '🚗',
      healthcare: '🏥',
      education: '📚',
      income: '💰',
      savings: '🐷',
      transfer: '💸',
      other: '📦',
    };
    return icons[category] || '📦';
  };

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <BarChart3 size={24} className="text-emerald-600" />
          Financial Overview
        </h2>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
        >
          {periods.map((period) => (
            <option key={period.value} value={period.value}>
              {period.label}
            </option>
          ))}
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Income Card */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Income</span>
            <TrendingUp size={20} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            ${stats.income.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {stats.periodTransactions.filter(t => t.type === 'receive').length} transactions
          </p>
        </div>

        {/* Expenses Card */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Expenses</span>
            <TrendingDown size={20} className="text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            ${stats.expenses.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {stats.periodTransactions.filter(t => ['send', 'bills'].includes(t.type)).length} transactions
          </p>
        </div>

        {/* Savings Card */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Savings</span>
            <PieChartIcon size={20} className="text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            ${stats.savings.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {stats.periodTransactions.filter(t => t.type === 'savings').length} transactions
          </p>
        </div>

        {/* Net Income Card */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Net</span>
            <DollarSign size={20} className={netIncome >= 0 ? 'text-emerald-500' : 'text-red-500'} />
          </div>
          <p className={`text-2xl font-bold ${
            netIncome >= 0 
              ? 'text-emerald-600 dark:text-emerald-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {netIncome >= 0 ? '+' : ''} ${netIncome.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {netIncome >= 0 ? 'Surplus' : 'Deficit'}
          </p>
        </div>
      </div>

      {/* Top Spending Categories */}
      {stats.topCategories.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <PieChartIcon size={20} className="text-emerald-600" />
            Top Spending Categories
          </h3>
          <div className="space-y-4">
            {stats.topCategories.map(([category, amount], index) => {
              const percentage = (amount / stats.expenses) * 100;
              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getCategoryIcon(category)}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {category.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        ${amount.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`${getCategoryColor(index)} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Spending Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/20 dark:to-gray-800">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            💡 Savings Rate
          </h4>
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
            {stats.income > 0 ? ((stats.savings / stats.income) * 100).toFixed(1) : '0'}%
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            of your income goes to savings
          </p>
        </div>

        <div className="card bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            📊 Expense Ratio
          </h4>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
            {stats.income > 0 ? ((stats.expenses / stats.income) * 100).toFixed(1) : '0'}%
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            of your income goes to expenses
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChartSection;
