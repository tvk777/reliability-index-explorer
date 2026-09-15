import { useMemo, useState } from 'react';
import type { Transaction } from '../../types/transaction';

type SortField = 'date' | 'amount';
type SortDirection = 'asc' | 'desc';

type TransactionTableProps = {
  transactions: Transaction[];
};

export const TransactionTable = ({ transactions }: TransactionTableProps) => {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      if (sortField === 'date') {
        return sortDirection === 'asc' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date);
      }

      return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    });
  }, [transactions, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortField(field);
    setSortDirection('desc');
  };

  const renderSortIndicator = (field: SortField) => {
    if (field !== sortField) {
      return null;
    }

    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className='mt-6 overflow-x-auto'>
      <table className='w-full text-left text-sm'>
        <thead>
          <tr className='border-b border-slate-200 text-slate-500'>
            <th className='px-4 py-3 font-medium'>
              <button type='button' onClick={() => handleSort('date')} className='hover:text-slate-900'>
                Date{renderSortIndicator('date')}
              </button>
            </th>

            <th className='px-4 py-3 font-medium'>Merchant</th>

            <th className='px-4 py-3 font-medium'>Description</th>

            <th className='px-4 py-3 font-medium'>Category</th>

            <th className='px-4 py-3 text-right font-medium'>
              <button type='button' onClick={() => handleSort('amount')} className='hover:text-slate-900'>
                Amount{renderSortIndicator('amount')}
              </button>
            </th>

            <th className='px-4 py-3 font-medium'>Type</th>
          </tr>
        </thead>

        <tbody>
          {sortedTransactions.map((transaction) => (
            <tr key={transaction.id} className='border-b border-slate-100 last:border-0'>
              <td className='px-4 py-3 text-slate-600'>{transaction.date}</td>

              <td className='px-4 py-3 font-medium text-slate-800'>{transaction.merchant_name}</td>

              <td className='px-4 py-3 text-slate-600'>{transaction.description}</td>

              <td className='px-4 py-3 text-slate-600'>{transaction.merchant_category_code}</td>

              <td className='px-4 py-3 text-right font-medium'>
                {transaction.amount.toFixed(2)} {transaction.currency}
              </td>

              <td className='px-4 py-3 text-slate-600'>{transaction.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
