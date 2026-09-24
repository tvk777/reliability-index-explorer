import { useMemo, useState, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ArrowUp, ArrowDown } from 'lucide-react';
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

const TYPE_BADGE: Record<Transaction['type'], string> = {
  debit: 'border-red-200 bg-red-50 text-red-700',
  credit: 'border-emerald-200 bg-emerald-50 text-emerald-700',
};

const AMOUNT_COLOR: Record<Transaction['type'], string> = {
  debit: 'text-red-600',
  credit: 'text-emerald-600',
};

const AMOUNT_SIGN: Record<Transaction['type'], string> = {
  debit: '−',
  credit: '+',
};

export const TransactionTable = ({ transactions, categoryMap }: TransactionTableProps) => {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const currency = transactions[0]?.currency;

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

    return sortDirection === 'asc' ? (
      <ArrowUp className='h-3.5 w-3.5 shrink-0' aria-hidden='true' />
    ) : (
      <ArrowDown className='h-3.5 w-3.5 shrink-0' aria-hidden='true' />
    );
  };

  const getAriaSort = (field: SortField): 'none' | 'ascending' | 'descending' => {
    if (field !== sortField) {
      return 'none';
    }

    return sortDirection === 'asc' ? 'ascending' : 'descending';
  };

  return (
    <div className='mt-6 overflow-x-auto'>
      <div role='table' className='min-w-[900px]'>
        <div
          role='row'
          className='grid border-b border-slate-200 text-slate-500'
          style={{ gridTemplateColumns: GRID_COLUMNS }}
        >
          <div role='columnheader' aria-sort={getAriaSort('date')} className='px-4 py-3 font-medium'>
            <button
              type='button'
              onClick={() => handleSort('date')}
              className='flex cursor-pointer items-center gap-1 rounded hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1'
            >
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

          <div
            role='columnheader'
            aria-sort={getAriaSort('amount')}
            className='flex justify-end px-4 py-3 font-medium'
          >
            <button
              type='button'
              onClick={() => handleSort('amount')}
              className='flex cursor-pointer items-center gap-1 rounded hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1'
            >
              Amount{currency ? ` (${currency})` : ''}
              {renderSortIndicator('amount')}
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
                  className='grid border-b border-slate-100 hover:bg-slate-50'
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

                  <div
                    role='cell'
                    className={`px-4 py-3 text-right font-medium tabular-nums ${AMOUNT_COLOR[transaction.type]}`}
                  >
                    {AMOUNT_SIGN[transaction.type]}
                    {transaction.amount.toFixed(2)} {transaction.currency}
                  </div>

                  <div role='cell' className='px-4 py-3'>
                    <span
                      className={`inline-flex rounded-md border px-1.5 py-0.5 text-xs font-medium capitalize ${TYPE_BADGE[transaction.type]}`}
                    >
                      {transaction.type}
                    </span>
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
