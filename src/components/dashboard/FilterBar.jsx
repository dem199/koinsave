'use client';

import React from 'react';
import { Calendar, DollarSign, Tag, X } from 'lucide-react';

const FilterBar = ({ filters, onFilterChange, onClearFilters, hasActiveFilters }) => {
  const transactionTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'receive', label: 'Received' },
    { value: 'send', label: 'Sent' },
    { value: 'bills', label: 'Bills' },
    { value: 'savings', label: 'Savings' },
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
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
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
      {/* Type and Category Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Transaction Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => onFilterChange({ type: e.target.value })}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
          >
            {transactionTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange({ category: e.target.value })}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Date Range Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
          <Calendar size={16} />
          Date Range
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => onFilterChange({ dateFrom: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
              placeholder="From"
            />
          </div>
          <div>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => onFilterChange({ dateTo: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
              placeholder="To"
            />
          </div>
        </div>
      </div>

      {/* Amount Range Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
          <DollarSign size={16} />
          Amount Range
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <input
              type="number"
              step="0.01"
              value={filters.minAmount}
              onChange={(e) => onFilterChange({ minAmount: e.target.value })}
              placeholder="Min amount"
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white placeholder:text-gray-400"
            />
          </div>
          <div>
            <input
              type="number"
              step="0.01"
              value={filters.maxAmount}
              onChange={(e) => onFilterChange({ maxAmount: e.target.value })}
              placeholder="Max amount"
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="flex justify-end pt-2">
          <button
            onClick={onClearFilters}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <X size={16} />
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
