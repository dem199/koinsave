'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { transactionAPI } from '@/lib/api';
import TransactionItem from './TransactionItem';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import Pagination from '@/components/shared/Pagination';
import SearchBar from './SearchBar';
import FilterBar from './FilterBar';
import ExportButton from './ExportButton';
import { Filter, SlidersHorizontal } from 'lucide-react';

const TransactionsList = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: '',
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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

  // Apply all filters and search
  const filteredTransactions = transactions.filter((txn) => {
    // Search filter
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
  txn.description?.toLowerCase().includes(searchLower) ||
  txn.recipient?.toLowerCase().includes(searchLower);

    if (!matchesSearch) return false;

    // Type filter
    if (filters.type !== 'all' && txn.type !== filters.type) return false;

    // Category filter
    if (filters.category !== 'all' && txn.category !== filters.category) return false;

    // Date range filter
    if (filters.dateFrom && new Date(txn.date) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && new Date(txn.date) > new Date(filters.dateTo)) return false;

    // Amount range filter
    if (filters.minAmount && txn.amount < parseFloat(filters.minAmount)) return false;
    if (filters.maxAmount && txn.amount > parseFloat(filters.maxAmount)) return false;

    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const clearFilters = () => {
    setFilters({
      type: 'all',
      category: 'all',
      dateFrom: '',
      dateTo: '',
      minAmount: '',
      maxAmount: '',
    });
    setSearchQuery('');
  };

  const hasActiveFilters = 
    filters.type !== 'all' ||
    filters.category !== 'all' ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.minAmount ||
    filters.maxAmount ||
    searchQuery;

  return (
    <div className="card">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Recent Transactions
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {filteredTransactions.length} of {transactions.length} transactions
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              showFilters || hasActiveFilters
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <SlidersHorizontal size={18} />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-white rounded-full"></span>
            )}
          </button>

          <ExportButton transactions={filteredTransactions} />
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by description or recipient..."
        />
      </div>

      {/* Filter Bar */}
      {showFilters && (
        <div className="mb-6">
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
            Active filters:
          </span>
          {filters.type !== 'all' && (
            <span className="text-xs bg-white dark:bg-gray-700 px-2 py-1 rounded">
              Type: {filters.type}
            </span>
          )}
          {filters.category !== 'all' && (
            <span className="text-xs bg-white dark:bg-gray-700 px-2 py-1 rounded">
              Category: {filters.category}
            </span>
          )}
          {(filters.dateFrom || filters.dateTo) && (
            <span className="text-xs bg-white dark:bg-gray-700 px-2 py-1 rounded">
              Date range
            </span>
          )}
          {(filters.minAmount || filters.maxAmount) && (
            <span className="text-xs bg-white dark:bg-gray-700 px-2 py-1 rounded">
              Amount range
            </span>
          )}
          {searchQuery && (
            <span className="text-xs bg-white dark:bg-gray-700 px-2 py-1 rounded">
              Search: {` "${searchQuery}" `}
            </span>
          )}
          <button
            onClick={clearFilters}
            className="ml-auto text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Transactions List */}
      {loading ? (
        <div className="py-12">
          <LoadingSpinner size="lg" text="Loading transactions..." />
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            {hasActiveFilters ? 'No transactions match your filters' : 'No transactions found'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-emerald-500 hover:text-emerald-600 text-sm font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-1">
            {currentTransactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredTransactions.length}
                itemsPerPage={itemsPerPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TransactionsList;
