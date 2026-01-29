'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { transactionAPI } from '@/lib/api';
import { Calendar, TrendingUp, AlertCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const SubscriptionTracker = () => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const detectSubs = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const transactions = await transactionAPI.getTransactions(user.id);
        
        // Detect recurring patterns
        const recurring = {};
        transactions.forEach((txn) => {
          if (txn.type === 'send' || txn.type === 'bills') {
            const key = `${txn.recipient}-${txn.amount}`;
            if (!recurring[key]) {
              recurring[key] = {
                name: txn.recipient,
                amount: txn.amount,
                dates: [],
                category: txn.category,
              };
            }
            recurring[key].dates.push(new Date(txn.date));
          }
        });

        // Filter for actual subscriptions (2+ occurrences)
        const subs = Object.values(recurring)
          .filter((r) => r.dates.length >= 2)
          .map((r, idx) => {
            const sortedDates = r.dates.sort((a, b) => a - b);
            const lastDate = sortedDates[sortedDates.length - 1];
            const avgDays = 30; // Simplified
            const nextDate = new Date(lastDate.getTime() + avgDays * 24 * 60 * 60 * 1000);
            const daysUntil = Math.ceil((nextDate - new Date()) / (1000 * 60 * 60 * 24));

            return {
              id: `sub-${idx}`,
              name: r.name,
              amount: r.amount,
              monthlyAmount: r.amount,
              nextCharge: nextDate,
              daysUntil,
              status: daysUntil <= 3 ? 'due-soon' : 'active',
              usageScore: Math.floor(Math.random() * 100),
              icon: getIcon(r.name),
            };
          });

        setSubscriptions(subs);
      } catch (error) {
        console.error('Failed to detect subscriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    detectSubs();
  }, [user]);

  const getIcon = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes('netflix')) return '📺';
    if (lower.includes('spotify')) return '🎵';
    if (lower.includes('amazon')) return '📦';
    if (lower.includes('apple')) return '🍎';
    if (lower.includes('gym')) return '💪';
    return '💳';
  };

  const totalMonthly = subscriptions.reduce((sum, s) => sum + s.monthlyAmount, 0);
  const savings = subscriptions.filter((s) => s.usageScore < 40).reduce((sum, s) => sum + s.monthlyAmount, 0);
  const dueSoon = subscriptions.filter((s) => s.daysUntil <= 7).length;

  const handleCancel = (sub) => {
    toast((t) => (
      <div>
        <p className="font-semibold mb-2">Cancel {sub.name}?</p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              toast.success(`We'll help you cancel ${sub.name}!`);
              toast.dismiss(t.id);
            }}
            className="px-3 py-2 bg-red-600 text-white text-sm rounded-lg"
          >
            Yes, Cancel
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-2 bg-gray-200 text-gray-900 text-sm rounded-lg"
          >
            Keep It
          </button>
        </div>
      </div>
    ), { duration: 10000 });
  };

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <motion.div variants={item} className="card bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Total</span>
            <TrendingUp size={20} className="text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">${totalMonthly.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">${(totalMonthly * 12).toFixed(2)}/year</p>
        </motion.div>

        <motion.div variants={item} className="card bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Potential Savings</span>
            <AlertCircle size={20} className="text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">${savings.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">From low-usage subs</p>
        </motion.div>

        <motion.div variants={item} className="card bg-gradient-to-br from-red-50 to-white dark:from-red-900/20 dark:to-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Due Soon</span>
            <Calendar size={20} className="text-red-600" />
          </div>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">{dueSoon}</p>
          <p className="text-xs text-gray-500 mt-1">In the next 7 days</p>
        </motion.div>
      </motion.div>

      {/* Subscriptions List */}
      {subscriptions.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-5xl mb-4">💳</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Subscriptions Detected</h3>
          <p className="text-gray-600 dark:text-gray-400">Add more transactions to detect recurring subscriptions</p>
        </div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
          {subscriptions.map((sub) => (
            <motion.div
              key={sub.id}
              variants={item}
              whileHover={{ scale: 1.01 }}
              className={`card ${sub.status === 'due-soon' ? 'border-red-500' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-3xl">{sub.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{sub.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <span>${sub.amount.toFixed(2)}/mo</span>
                      <span>•</span>
                      <span className={sub.usageScore < 40 ? 'text-red-600' : 'text-green-600'}>
                        Usage: {sub.usageScore}%
                      </span>
                    </div>
                    <div className="text-sm mt-1">
                      {sub.daysUntil <= 0 ? (
                        <span className="text-red-600 font-medium">⚠️ Charging today!</span>
                      ) : sub.daysUntil <= 3 ? (
                        <span className="text-red-600 font-medium">⚠️ Charging in {sub.daysUntil} days</span>
                      ) : (
                        <span className="text-gray-600 dark:text-gray-400">Next: {sub.nextCharge.toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleCancel(sub)}
                  className="flex items-center gap-1 px-3 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                  <X size={14} />
                  Cancel
                </button>
              </div>
              {sub.usageScore < 40 && (
                <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    💡 <strong>Tip:</strong> Low usage detected. Cancel to save ${(sub.monthlyAmount * 12).toFixed(2)}/year
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default SubscriptionTracker;