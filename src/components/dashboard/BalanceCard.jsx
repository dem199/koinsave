'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, TrendingUp, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="balance-card relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Wallet size={24} />
            <h2 className="text-lg font-semibold">Total Balance</h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowBalance(!showBalance)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={showBalance ? 'visible' : 'hidden'}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="mb-6"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              {showBalance ? formatCurrency(user?.balance || 0) : '••••••'}
            </h1>
            <p className="text-emerald-100 text-sm">
              Account Number: {user?.accountNumber || 'N/A'}
            </p>
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 text-emerald-100"
        >
          <TrendingUp size={16} />
          <span className="text-sm">+12.5% from last month</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BalanceCard;