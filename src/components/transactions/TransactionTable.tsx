import { useMemo, useState, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { Transaction } from '../../types/transaction';
import type { MerchantCategory } from '../../types/merchantCategory';

type SortField = 'date' | 'amount';
type SortDirection = 'asc' | 'desc';

type TransactionTableProps = {
  transactions: Transaction[];
  categoryMap: Map<string, MerchantCategory>;
};

const GRID_COLUMNS = '120px minmax(140px, 1.2fr) minmax(180px, 2fr) minmax(140px, 1.3fr) 120px 80px';

const ROW_HEIGHT = 53;

export const TransactionTable = ({ transactions, categoryMap }: TransactionTableProps) => {
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

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: sortedTransactions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
  });

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
      <div role='table' className='min-w-[900px]'>
        <div
          role='row'
          className='grid border-b border-slate-200 text-slate-500'
          style={{ gridTemplateColumns: GRID_COLUMNS }}
        >
          <div role='columnheader' className='px-4 py-3 font-medium'>
            <button type='button' onClick={() => handleSort('date')} className='hover:text-slate-900'>
              Date{renderSortIndicator('date')}
            </button>
          </div>

          <div role='columnheader' className='px-4 py-3 font-medium'>
            Merchant
          </div>

          <div role='columnheader' className='px-4 py-3 font-medium'>
            Description
          </div>

          <div role='columnheader' className='px-4 py-3 font-medium'>
            Category
          </div>

          <div role='columnheader' className='px-4 py-3 text-right font-medium'>
            <button type='button' onClick={() => handleSort('amount')} className='hover:text-slate-900'>
              Amount{renderSortIndicator('amount')}
            </button>
          </div>

          <div role='columnheader' className='px-4 py-3 font-medium'>
            Type
          </div>
        </div>
        <div ref={parentRef} className='max-h-[600px] overflow-y-auto'>
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const transaction = sortedTransactions[virtualRow.index];

              return (
                <div
                  key={transaction.id}
                  role='row'
                  className='grid border-b border-slate-100'
                  style={{
                    gridTemplateColumns: GRID_COLUMNS,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <div role='cell' className='px-4 py-3 text-slate-600'>
                    {transaction.date}
                  </div>

                  <div role='cell' className='px-4 py-3 font-medium text-slate-800'>
                    {transaction.merchant_name}
                  </div>

                  <div role='cell' className='px-4 py-3 text-slate-600'>
                    {transaction.description}
                  </div>

                  <div role='cell' className='px-4 py-3 text-slate-600'>
                    {categoryMap.get(transaction.merchant_category_code)?.name}
                  </div>

                  <div role='cell' className='px-4 py-3 text-right font-medium'>
                    {transaction.amount.toFixed(2)} {transaction.currency}
                  </div>

                  <div role='cell' className='px-4 py-3 text-slate-600'>
                    {transaction.type}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
