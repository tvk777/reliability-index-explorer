import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Search, SearchX } from 'lucide-react';
import { useMerchantCategories } from '../../hooks/useMerchantCategories';
import { useTransactions } from '../../hooks/useTransactions';
import type { ScoringWindow } from '../../utils/scoringWindow';
import { TransactionTable } from './TransactionTable';
import { CashflowTimeline } from '../cashflow/CashflowTimeline';
import { useTransactionEvents } from '../../hooks/useTransactionEvents';

type TransactionsViewProps = {
  userId: string;
  scoringWindow: ScoringWindow;
};

type TransactionTypeFilter = 'all' | 'debit' | 'credit';

const SEARCH_DEBOUNCE_MS = 200;

export const TransactionsView = ({ userId, scoringWindow }: TransactionsViewProps) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState<TransactionTypeFilter>('all');
  const [merchantSearch, setMerchantSearch] = useState('');
  const [debouncedMerchantSearch, setDebouncedMerchantSearch] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedMerchantSearch(merchantSearch);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [merchantSearch]);

  const hasActiveFilters = selectedCategory !== 'all' || selectedType !== 'all' || merchantSearch !== '';

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedType('all');
    setMerchantSearch('');
    setDebouncedMerchantSearch('');
  };

  const {
    data: transactions,
    isPending: isTransactionsPending,
    isError: isTransactionsError,
    error: transactionsError,
    refetch: refetchTransactions,
  } = useTransactions(userId, scoringWindow.start, scoringWindow.end);

  const {
    data: categories,
    isPending: isCategoriesPending,
    isError: isCategoriesError,
    error: categoriesError,
    refetch: refetchCategories,
  } = useMerchantCategories();

  useTransactionEvents({
    userId,
    scoringWindow,
  });

  const categoryMap = useMemo(() => {
    if (!categories) {
      return new Map();
    }

    return new Map(categories.categories.map((category) => [category.code, category]));
  }, [categories]);

  const availableCategoryCodes = useMemo(() => {
    if (!transactions) {
      return new Set<string>();
    }

    return new Set(transactions.transactions.map((transaction) => transaction.merchant_category_code));
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    if (!transactions) {
      return [];
    }

    const search = debouncedMerchantSearch.trim().toLowerCase();

    return transactions.transactions.filter((transaction) => {
      const matchesCategory = selectedCategory === 'all' || transaction.merchant_category_code === selectedCategory;

      const matchesType = selectedType === 'all' || transaction.type === selectedType;

      const matchesMerchant = !search || transaction.merchant_name.toLowerCase().includes(search);

      return matchesCategory && matchesType && matchesMerchant;
    });
  }, [transactions, selectedCategory, selectedType, debouncedMerchantSearch]);

  if (isTransactionsPending || isCategoriesPending) {
    return (
      <section className='mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6'>
        <div className='animate-pulse space-y-4'>
          <div className='h-4 w-28 rounded bg-slate-200' />
          <div className='h-3 w-56 rounded bg-slate-200' />

          <div className='flex flex-wrap gap-4 pt-2'>
            <div className='h-9 w-full max-w-sm rounded-lg bg-slate-200' />
            <div className='h-9 w-32 rounded-lg bg-slate-200' />
            <div className='h-9 w-32 rounded-lg bg-slate-200' />
          </div>

          <div className='space-y-2 pt-2'>
            <div className='h-10 w-full rounded bg-slate-200' />
            <div className='h-10 w-full rounded bg-slate-200' />
            <div className='h-10 w-full rounded bg-slate-200' />
          </div>
        </div>
      </section>
    );
  }

  if (isTransactionsError) {
    return (
      <section className='mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6'>
        <div className='flex items-start gap-3'>
          <AlertCircle className='mt-0.5 h-5 w-5 shrink-0 text-red-600' aria-hidden='true' />

          <div>
            <p className='text-sm font-semibold text-slate-900'>Failed to load transactions</p>

            <p className='mt-1 text-sm text-slate-600'>{transactionsError.message}</p>

            <button
              type='button'
              onClick={() => refetchTransactions()}
              className='mt-3 cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50'
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (isCategoriesError) {
    return (
      <section className='mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6'>
        <div className='flex items-start gap-3'>
          <AlertCircle className='mt-0.5 h-5 w-5 shrink-0 text-red-600' aria-hidden='true' />

          <div>
            <p className='text-sm font-semibold text-slate-900'>Failed to load merchant categories</p>

            <p className='mt-1 text-sm text-slate-600'>{categoriesError.message}</p>

            <button
              type='button'
              onClick={() => refetchCategories()}
              className='mt-3 cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50'
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className='mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6'>
        <h2 className='text-base font-semibold text-slate-900'>Transactions</h2>

        <p className='mt-1 text-sm text-slate-500'>Browse and filter transactions within the scoring window.</p>

        <div className='mt-4 flex flex-wrap items-end gap-4'>
          <div className='flex-1 min-w-[220px]'>
            <label htmlFor='merchant-search' className='block text-sm font-medium text-slate-700'>
              Merchant
            </label>

            <div className='relative mt-1'>
              <Search
                className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400'
                aria-hidden='true'
              />

              <input
                id='merchant-search'
                type='search'
                value={merchantSearch}
                onChange={(event) => setMerchantSearch(event.target.value)}
                placeholder='Search merchant...'
                className='w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-slate-500'
              />
            </div>
          </div>

          <div>
            <label htmlFor='category-filter' className='block text-sm font-medium text-slate-700'>
              Category
            </label>

            <select
              id='category-filter'
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className='mt-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm'
            >
              <option value='all'>All categories</option>

              {categories.categories
                .filter((category) => availableCategoryCodes.has(category.code))
                .map((category) => (
                  <option key={category.code} value={category.code}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label htmlFor='type-filter' className='block text-sm font-medium text-slate-700'>
              Type
            </label>

            <select
              id='type-filter'
              value={selectedType}
              onChange={(event) => setSelectedType(event.target.value as TransactionTypeFilter)}
              className='mt-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm'
            >
              <option value='all'>All types</option>
              <option value='debit'>Debit</option>
              <option value='credit'>Credit</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type='button'
              onClick={handleClearFilters}
              className='cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50'
            >
              Clear filters
            </button>
          )}
        </div>

        <p className='mt-4 text-sm font-semibold text-slate-900'>
          Showing {filteredTransactions.length} of {transactions.total} transactions
        </p>

        {filteredTransactions.length === 0 ? (
          <div className='mt-6 flex flex-col items-center rounded-lg border border-dashed border-slate-300 p-8 text-center'>
            <SearchX className='h-8 w-8 text-slate-400' aria-hidden='true' />

            <p className='mt-3 font-medium text-slate-700'>No transactions found</p>
            <p className='mt-1 text-sm text-slate-500'>Try adjusting your search or filters.</p>

            {hasActiveFilters && (
              <button
                type='button'
                onClick={handleClearFilters}
                className='mt-4 cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50'
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <TransactionTable transactions={filteredTransactions} categoryMap={categoryMap} />
        )}
      </section>
      <CashflowTimeline transactions={transactions.transactions} scoringWindow={scoringWindow} />
    </>
  );
};
