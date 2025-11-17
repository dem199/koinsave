'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, TrendingUp, Wallet } from 'lucide-react';

const BalanceCard = () => {
  const { user } = useAuth();
  const [showBalance, setShowBalance] = useState(true);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: user?.currency || 'USD',
    }).format(amount);
  };

  return (
    <div className="balance-card relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Wallet size={24} />
            <h2 className="text-lg font-semibold">Total Balance</h2>
          </div>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="mb-6">
          {showBalance ? (
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              {formatCurrency(user?.balance || 0)}
            </h1>
          ) : (
            <h1 className="text-4xl md:text-5xl font-bold mb-2">••••••</h1>
          )}
          <p className="text-emerald-100 text-sm">
            Account Number: {user?.accountNumber || 'N/A'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-emerald-100">
          <TrendingUp size={16} />
          <span className="text-sm">
            +12.5% from last month
          </span>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;