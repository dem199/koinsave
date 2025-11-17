'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { transactionAPI } from '@/lib/api';
import TransactionItem from './TransactionItem';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Filter } from 'lucide-react';

const TransactionsList = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await transactionAPI.getTransactions(user.id);
        // Sort by date, newest first
        const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setTransactions(sorted);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchTransactions();
    }
  }, [user]);

  const filteredTransactions = transactions.filter((txn) => {
    if (filter === 'all') return true;
    return txn.type === filter;
  });

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'receive', label: 'Received' },
    { value: 'send', label: 'Sent' },
    { value: 'bills', label: 'Bills' },
    { value: 'savings', label: 'Savings' },
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Recent Transactions
        </h2>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-sm border-none bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-12">
          <LoadingSpinner size="lg" text="Loading transactions..." />
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            No transactions found
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {filteredTransactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionsList;