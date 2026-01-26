'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { sendMoneySchema } from '@/lib/validations';
import { useAuth } from '@/context/AuthContext';
import { transactionAPI, userAPI } from '@/lib/api';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import { X, Send, User, DollarSign, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

// This is the Helper function to generate transaction ID (moved outside component)
const generateTransactionId = () => {
  return `txn_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
};

const SendMoneyModal = ({ isOpen, onClose, onSuccess }) => {
  const { user, updateUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(sendMoneySchema),
    defaultValues: {
      recipient: '',
      amount: '',
      description: '',
    },
  });

  const onSubmit = async (data) => {
    const amount = parseFloat(data.amount);

    // Check if user has sufficient balance
    if (amount > user.balance) {
      toast.error('Insufficient balance');
      return;
    }

    try {
      // Create transaction
      const transaction = {
        id: generateTransactionId(),
        userId: user.id,
        type: 'send',
        amount: amount,
        description: data.description,
        recipient: data.recipient,
        status: 'completed',
        date: new Date().toISOString(),
        category: 'transfer',
      };

      await transactionAPI.createTransaction(transaction);

      // Update user balance
      const newBalance = user.balance - amount;
      await userAPI.updateBalance(user.id, newBalance);
      updateUser({ balance: newBalance });

      toast.success('Money sent successfully!');
      reset();
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.message || 'Failed to send money');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
              <Send size={20} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Send Money
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Balance Info */}
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
            <p className="text-sm text-emerald-800 dark:text-emerald-200 mb-1">
              Available Balance
            </p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              ${user?.balance?.toFixed(2)}
            </p>
          </div>

          <Input
            label="Recipient Name"
            type="text"
            placeholder="John Doe"
            icon={User}
            error={errors.recipient?.message}
            {...register('recipient')}
          />

          <Input
            label="Amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            icon={DollarSign}
            error={errors.amount?.message}
            {...register('amount')}
          />

          <Input
            label="Description"
            type="text"
            placeholder="What's this for?"
            icon={FileText}
            error={errors.description?.message}
            {...register('description')}
          />

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={isSubmitting}
            >
              Send Money
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendMoneyModal;