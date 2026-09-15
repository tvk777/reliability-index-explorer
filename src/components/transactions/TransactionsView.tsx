import { useTransactions } from '../../hooks/useTransactions';
import type { ScoringWindow } from '../../utils/scoringWindow';

type TransactionsViewProps = {
  userId: string;
  scoringWindow: ScoringWindow;
};

export const TransactionsView = ({ userId, scoringWindow }: TransactionsViewProps) => {
  const {
    data: transactions,
    isPending,
    isError,
    error,
  } = useTransactions(userId, scoringWindow.start, scoringWindow.end);

  if (isPending) {
    return (
      <section className='mt-6 rounded-2xl bg-white p-6 shadow-sm'>
        <p className='text-sm text-slate-500'>Loading transactions...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className='mt-6 rounded-2xl bg-white p-6 shadow-sm'>
        <p className='text-sm text-red-600'>Error loading transactions: {error.message}</p>
      </section>
    );
  }

  return (
    <section className='mt-6 rounded-2xl bg-white p-6 shadow-sm'>
      <h2 className='text-2xl font-semibold text-slate-900'>Transactions</h2>

      <p className='mt-2 text-sm text-slate-500'>{transactions.total} transactions loaded.</p>
    </section>
  );
};
