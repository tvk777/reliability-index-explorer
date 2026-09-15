import { useMemo, useState } from 'react';
import { useMerchantCategories } from '../../hooks/useMerchantCategories';
import { useTransactions } from '../../hooks/useTransactions';
import type { ScoringWindow } from '../../utils/scoringWindow';
import { TransactionTable } from './TransactionTable';

type TransactionsViewProps = {
  userId: string;
  scoringWindow: ScoringWindow;
};

type TransactionTypeFilter = 'all' | 'debit' | 'credit';

export const TransactionsView = ({ userId, scoringWindow }: TransactionsViewProps) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState<TransactionTypeFilter>('all');
  const [merchantSearch, setMerchantSearch] = useState('');

  const {
    data: transactions,
    isPending: isTransactionsPending,
    isError: isTransactionsError,
    error: transactionsError,
  } = useTransactions(userId, scoringWindow.start, scoringWindow.end);

  const {
    data: categories,
    isPending: isCategoriesPending,
    isError: isCategoriesError,
    error: categoriesError,
  } = useMerchantCategories();

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

    const search = merchantSearch.trim().toLowerCase();

    return transactions.transactions.filter((transaction) => {
      const matchesCategory = selectedCategory === 'all' || transaction.merchant_category_code === selectedCategory;

      const matchesType = selectedType === 'all' || transaction.type === selectedType;

      const matchesMerchant = !search || transaction.merchant_name.toLowerCase().includes(search);

      return matchesCategory && matchesType && matchesMerchant;
    });
  }, [transactions, selectedCategory, selectedType, merchantSearch]);

  if (isTransactionsPending || isCategoriesPending) {
    return (
      <section className='mt-6 rounded-2xl bg-white p-6 shadow-sm'>
        <p className='text-sm text-slate-500'>Loading transactions...</p>
      </section>
    );
  }

  if (isTransactionsError) {
    return (
      <section className='mt-6 rounded-2xl bg-white p-6 shadow-sm'>
        <p className='text-sm text-red-600'>Error loading transactions: {transactionsError.message}</p>
      </section>
    );
  }

  if (isCategoriesError) {
    return (
      <section className='mt-6 rounded-2xl bg-white p-6 shadow-sm'>
        <p className='text-sm text-red-600'>Error loading categories: {categoriesError.message}</p>
      </section>
    );
  }

  return (
    <section className='mt-6 rounded-2xl bg-white p-6 shadow-sm'>
      <h2 className='text-2xl font-semibold text-slate-900'>Transactions</h2>

      <div className='mt-4'>
        <label htmlFor='merchant-search' className='block text-sm font-medium text-slate-700'>
          Merchant
        </label>

        <input
          id='merchant-search'
          type='search'
          value={merchantSearch}
          onChange={(event) => setMerchantSearch(event.target.value)}
          placeholder='Search merchant...'
          className='mt-1 w-full max-w-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500'
        />
      </div>

      <div className='mt-4 flex flex-wrap gap-4'>
        <div>
          <label htmlFor='category-filter' className='mr-3 text-sm font-medium text-slate-700'>
            Category
          </label>

          <select
            id='category-filter'
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            className='rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm'
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
          <label htmlFor='type-filter' className='mr-3 text-sm font-medium text-slate-700'>
            Type
          </label>

          <select
            id='type-filter'
            value={selectedType}
            onChange={(event) => setSelectedType(event.target.value as TransactionTypeFilter)}
            className='rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm'
          >
            <option value='all'>All types</option>
            <option value='debit'>Debit</option>
            <option value='credit'>Credit</option>
          </select>
        </div>
      </div>

      <p className='mt-4 text-sm text-slate-500'>
        Showing {filteredTransactions.length} of {transactions.total} transactions
      </p>

      {filteredTransactions.length === 0 ? (
        <div className='mt-6 rounded-lg border border-dashed border-slate-300 p-8 text-center'>
          <p className='font-medium text-slate-700'>No transactions found</p>
          <p className='mt-1 text-sm text-slate-500'>Try adjusting your search or filters.</p>
        </div>
      ) : (
        <TransactionTable transactions={filteredTransactions} categoryMap={categoryMap} />
      )}
    </section>
  );
};
