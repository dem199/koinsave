import React from 'react';
import { ArrowDownLeft, ArrowUpRight, CreditCard, PiggyBank } from 'lucide-react';

const TransactionItem = ({ transaction }) => {
  const getTransactionIcon = (type) => {
    switch (type) {
      case 'receive':
        return <ArrowDownLeft className="text-emerald-500" size={20} />;
      case 'send':
        return <ArrowUpRight className="text-red-500" size={20} />;
      case 'bills':
        return <CreditCard className="text-blue-500" size={20} />;
      case 'savings':
        return <PiggyBank className="text-purple-500" size={20} />;
      default:
        return <ArrowUpRight className="text-gray-500" size={20} />;
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'receive':
        return 'text-emerald-600 dark:text-emerald-400';
      case 'send':
      case 'bills':
        return 'text-red-600 dark:text-red-400';
      case 'savings':
        return 'text-purple-600 dark:text-purple-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const formatAmount = (amount, type) => {
    const prefix = type === 'receive' ? '+' : '-';
    return `${prefix}$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <div className="transaction-item">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
          {getTransactionIcon(transaction.type)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 dark:text-white truncate">
            {transaction.description}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {transaction.recipient}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
          {formatAmount(transaction.amount, transaction.type)}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(transaction.date)}
        </p>
      </div>
    </div>
  );
};

export default TransactionItem;