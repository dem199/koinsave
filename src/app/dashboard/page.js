'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import BalanceCard from '@/components/dashboard/BalanceCard';
import QuickActions from '@/components/dashboard/QuickActions';
import TransactionsList from '@/components/dashboard/TransactionsList';
import SendMoneyModal from '@/components/dashboard/SendMoneyModal';

export default function DashboardPage() {
  const [isSendMoneyOpen, setIsSendMoneyOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSendMoneySuccess = () => {
    // Refresh transactions list by changing key
    setRefreshKey(prev => prev + 1);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <DashboardHeader />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="p-4 bg-white dark:bg-black text-black dark:text-white">
  TEST: This should be white bg / black text in light mode, and black bg / white text in dark mode
</div>
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Here is what is happening with your money today.
            </p>
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

          {/* Transactions List */}
          <div key={refreshKey}>
            <TransactionsList />
          </div>
        </main>

        {/* Send Money Modal */}
        <SendMoneyModal
          isOpen={isSendMoneyOpen}
          onClose={() => setIsSendMoneyOpen(false)}
          onSuccess={handleSendMoneySuccess}
        />
      </div>
    </ProtectedRoute>
  );
}