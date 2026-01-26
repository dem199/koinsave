'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addExpenseSchema } from '@/lib/validations';
import { useAuth } from '@/context/AuthContext';
import { transactionAPI, userAPI } from '@/lib/api';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import { X, Plus, DollarSign, FileText, Tag, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const generateTransactionId = () => {
  return `txn_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
};

const AddExpenseModal = ({ isOpen, onClose, onSuccess }) => {
  const { user, updateUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(addExpenseSchema),
    defaultValues: {
      type: 'send',
      amount: '',
      description: '',
      category: 'other',
      recipient: '',
      date: new Date().toISOString().split('T')[0],
    },
  });

  const transactionType = watch('type');

  const transactionTypes = [
    { value: 'send', label: 'Expense', icon: '💸' },
    { value: 'receive', label: 'Income', icon: '💰' },
    { value: 'bills', label: 'Bill Payment', icon: '💳' },
    { value: 'savings', label: 'Savings', icon: '🐷' },
  ];

  const categories = [
    { value: 'income', label: 'Income' },
    { value: 'transfer', label: 'Transfer' },
    { value: 'housing', label: 'Housing' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'food', label: 'Food & Dining' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'savings', label: 'Savings' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
    { value: 'other', label: 'Other' },
  ];

  const onSubmit = async (data) => {
    const amount = parseFloat(data.amount);

    // Check balance for expenses
    if ((data.type === 'send' || data.type === 'bills') && amount > user.balance) {
      toast.error('Insufficient balance');
      return;
    }

    try {
      // Create transaction
      const transaction = {
        id: generateTransactionId(),
        userId: user.id,
        type: data.type,
        amount: amount,
        description: data.description,
        recipient: data.recipient || (data.type === 'receive' ? 'Income Source' : 'Expense'),
        status: 'completed',
        date: new Date(data.date).toISOString(),
        category: data.category,
      };

      await transactionAPI.createTransaction(transaction);

      // Update user balance
      let newBalance = user.balance;
      if (data.type === 'receive') {
        newBalance += amount;
      } else {
        newBalance -= amount;
      }

      await userAPI.updateBalance(user.id, newBalance);
      updateUser({ balance: newBalance });

      const successMessage =
        data.type === 'receive'
          ? 'Income recorded successfully!'
          : 'Expense recorded successfully!';

      toast.success(successMessage);
      reset();
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.message || 'Failed to add transaction');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content max-w-2xl" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
              <Plus size={20} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Add Transaction
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
          <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Current Balance
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${user?.balance?.toFixed(2)}
            </p>
          </div>

          {/* Transaction Type */}
          <div>
            <label className="label">Transaction Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {transactionTypes.map((type) => (
                <label
                  key={type.value}
                  className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    transactionType === type.value
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300'
                  }`}
                >
                  <input
                    type="radio"
                    value={type.value}
                    {...register('type')}
                    className="sr-only"
                  />
                  <span className="text-2xl">{type.icon}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {type.label}
                  </span>
                </label>
              ))}
            </div>
            {errors.type && (
              <p className="error-text">{errors.type.message}</p>
            )}
          </div>

          {/* Amount and Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              label="Date"
              type="date"
              icon={Calendar}
              error={errors.date?.message}
              {...register('date')}
            />
          </div>

          {/* Category */}
          <div>
            <label className="label flex items-center gap-2">
              <Tag size={16} />
              Category
            </label>
            <select
              {...register('category')}
              className="input-field"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="error-text">{errors.category.message}</p>
            )}
          </div>

          {/* Description */}
          <Input
            label="Description"
            type="text"
            placeholder="What's this transaction for?"
            icon={FileText}
            error={errors.description?.message}
            {...register('description')}
          />

          {/* Recipient */}
          <Input
            label={transactionType === 'receive' ? 'Source' : 'Recipient'}
            type="text"
            placeholder={
              transactionType === 'receive'
                ? 'Where did this come from?'
                : 'Who/what did you pay?'
            }
            icon={FileText}
            error={errors.recipient?.message}
            {...register('recipient')}
          />

          {/* Preview */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-2 font-medium">
              Transaction Preview:
            </p>
            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <p>
                Type: <span className="font-semibold capitalize">{transactionType}</span>
              </p>
              <p>
                Impact on balance:{' '}
                <span className={`font-semibold ${
                  transactionType === 'receive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transactionType === 'receive' ? '+' : '-'}$
                  {watch('amount') || '0.00'}
                </span>
              </p>
            </div>
          </div>

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
              Add Transaction
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
