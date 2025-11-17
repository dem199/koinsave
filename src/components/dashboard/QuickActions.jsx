

import React from 'react';
import { Send, Download, CreditCard, PiggyBank } from 'lucide-react';

const QuickActions = ({ onSendMoney }) => {
  const actions = [
    {
      icon: Send,
      label: 'Send',
      color: 'emerald',
      onClick: onSendMoney,
    },
    {
      icon: Download,
      label: 'Request',
      color: 'blue',
      onClick: () => alert('Request money feature coming soon!'),
    },
    {
      icon: CreditCard,
      label: 'Bills',
      color: 'purple',
      onClick: () => alert('Pay bills feature coming soon!'),
    },
    {
      icon: PiggyBank,
      label: 'Save',
      color: 'pink',
      onClick: () => alert('Savings feature coming soon!'),
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50',
      blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50',
      purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50',
      pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 hover:bg-pink-200 dark:hover:bg-pink-900/50',
    };
    return colors[color] || colors.emerald;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <button
            key={index}
            onClick={action.onClick}
            className={`${getColorClasses(action.color)} p-6 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 flex flex-col items-center gap-3`}
          >
            <Icon size={28} />
            <span className="font-medium">{action.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default QuickActions;