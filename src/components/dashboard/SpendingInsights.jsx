'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { transactionAPI } from '@/lib/api';
import { Lightbulb, TrendingUp, TrendingDown, AlertCircle, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SpendingInsights() {
  const { user } = useAuth();
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateInsights = async () => {
      if (!user?.id) return;

      try {
        const transactions = await transactionAPI.getTransactions(user.id);
        const now = new Date();
        const thisMonth = transactions.filter(t => {
          const date = new Date(t.date);
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        });

        const lastMonth = transactions.filter(t => {
          const date = new Date(t.date);
          const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
          return date.getMonth() === lastMonthDate.getMonth();
        });

        const newInsights = [];

        // Insight 1: Spending Trend
        const thisMonthSpent = thisMonth
          .filter(t => t.type === 'send' || t.type === 'bills')
          .reduce((sum, t) => sum + t.amount, 0);

        const lastMonthSpent = lastMonth
          .filter(t => t.type === 'send' || t.type === 'bills')
          .reduce((sum, t) => sum + t.amount, 0);

        const percentChange = lastMonthSpent > 0 
          ? ((thisMonthSpent - lastMonthSpent) / lastMonthSpent * 100).toFixed(1)
          : 0;

        if (percentChange > 10) {
          newInsights.push({
            id: 1,
            type: 'warning',
            icon: TrendingUp,
            title: 'Spending Alert',
            message: `You're spending ${percentChange}% more than last month. Consider reviewing your expenses.`,
            color: 'red',
          });
        } else if (percentChange < -10) {
          newInsights.push({
            id: 2,
            type: 'success',
            icon: Trophy,
            title: 'Great Job!',
            message: `You've reduced spending by ${Math.abs(percentChange)}% compared to last month!`,
            color: 'green',
          });
        }

        // Insight 2: Top Category
        const categorySpending = {};
        thisMonth
          .filter(t => t.type === 'send' || t.type === 'bills')
          .forEach(t => {
            categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
          });

        const topCategory = Object.entries(categorySpending).sort((a, b) => b[1] - a[1])[0];
        if (topCategory) {
          newInsights.push({
            id: 3,
            type: 'info',
            icon: AlertCircle,
            title: 'Top Spending Category',
            message: `Most money went to ${topCategory[0]}: $${topCategory[1].toFixed(2)}. Is this aligned with your priorities?`,
            color: 'blue',
          });
        }

        // Insight 3: Savings Potential
        const smallPurchases = thisMonth
          .filter(t => (t.type === 'send' || t.type === 'bills') && t.amount < 20)
          .reduce((sum, t) => sum + t.amount, 0);

        if (smallPurchases > 100) {
          newInsights.push({
            id: 4,
            type: 'tip',
            icon: Lightbulb,
            title: 'Savings Opportunity',
            message: `You spent $${smallPurchases.toFixed(2)} on small purchases. Reducing these by 50% could save you $${(smallPurchases * 6).toFixed(2)}/year!`,
            color: 'yellow',
          });
        }

        // Insight 4: Income vs Expenses
        const income = thisMonth
          .filter(t => t.type === 'receive')
          .reduce((sum, t) => sum + t.amount, 0);

        const savingsRate = income > 0 ? ((income - thisMonthSpent) / income * 100).toFixed(1) : 0;

        if (savingsRate > 20) {
          newInsights.push({
            id: 5,
            type: 'success',
            icon: Trophy,
            title: 'Excellent Savings Rate!',
            message: `You're saving ${savingsRate}% of your income. Keep it up!`,
            color: 'green',
          });
        } else if (savingsRate < 10 && income > 0) {
          newInsights.push({
            id: 6,
            type: 'warning',
            icon: TrendingDown,
            title: 'Low Savings Rate',
            message: `You're only saving ${savingsRate}% of your income. Aim for at least 20%.`,
            color: 'orange',
          });
        }

        setInsights(newInsights.slice(0, 3)); // Show max 3 insights
      } catch (error) {
        console.error('Failed to generate insights:', error);
      } finally {
        setLoading(false);
      }
    };

    generateInsights();
  }, [user]);

  const getColorClasses = (color) => {
    const colors = {
      red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100',
      green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100',
      blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100',
      yellow: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-100',
      orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-900 dark:text-orange-100',
    };
    return colors[color] || colors.blue;
  };

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className="card text-center py-8">
        <Lightbulb size={40} className="mx-auto mb-3 text-gray-400" />
        <p className="text-gray-600 dark:text-gray-400">
          Add more transactions to get personalized insights!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <Lightbulb size={20} className="text-yellow-500" />
        Your Money Insights
      </h2>

      {insights.map((insight, index) => {
        const Icon = insight.icon;
        return (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`border rounded-lg p-4 ${getColorClasses(insight.color)}`}
          >
            <div className="flex items-start gap-3">
              <Icon size={24} className="flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{insight.title}</h3>
                <p className="text-sm opacity-90">{insight.message}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}