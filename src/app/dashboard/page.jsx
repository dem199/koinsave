'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import BalanceCard from '@/components/dashboard/BalanceCard';
import QuickActions from '@/components/dashboard/QuickActions';
import TransactionsList from '@/components/dashboard/TransactionsList';
import SendMoneyModal from '@/components/dashboard/SendMoneyModal';
import AddExpenseModal from '@/components/dashboard/AddExpenseModal';
import ChartSection from '@/components/dashboard/ChartSection';
import { Plus } from 'lucide-react';

export default function DashboardPage() {
  const [isSendMoneyOpen, setIsSendMoneyOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTransactionSuccess = () => {
    // This will refresh transactions list and charts by changing key
    setRefreshKey(prev => prev + 1);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <DashboardHeader />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Welcome Section */}
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Here&apos;s what&apos;s happening with your money today.
              </p>
            </div>

            {/* Quick Add Transaction Button */}
            <button
              onClick={() => setIsAddExpenseOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-all hover:shadow-lg active:scale-95"
            >
              <Plus size={20} />
              <span>Add Transaction</span>
            </button>
          </div>

          {/* Balance Card */}
          <div className="mb-8">
            <BalanceCard />
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <QuickActions onSendMoney={() => setIsSendMoneyOpen(true)} />
          </div>

          {/* Charts Section */}
          <div key={`charts-${refreshKey}`} className="mb-8">
            <ChartSection />
          </div>

          {/* Transactions List */}
          <div key={`transactions-${refreshKey}`}>
            <TransactionsList />
          </div>
        </main>

        {/* Modals */}
        <SendMoneyModal
          isOpen={isSendMoneyOpen}
          onClose={() => setIsSendMoneyOpen(false)}
          onSuccess={handleTransactionSuccess}
        />

        <AddExpenseModal
          isOpen={isAddExpenseOpen}
          onClose={() => setIsAddExpenseOpen(false)}
          onSuccess={handleTransactionSuccess}
        />
      </div>
    </ProtectedRoute>
  );
}
