import { useMemo } from 'react';
import type { Transaction } from '../../types/transaction';
import type { ScoringWindow } from '../../utils/scoringWindow';
import { getMonthlyCashflow } from '../../utils/cashflow';

type CashflowTimelineProps = {
  transactions: Transaction[];
  scoringWindow: ScoringWindow;
};

export const CashflowTimeline = ({ transactions, scoringWindow }: CashflowTimelineProps) => {
  const monthlyCashflow = useMemo(
    () => getMonthlyCashflow(transactions, scoringWindow.start, scoringWindow.end),
    [transactions, scoringWindow],
  );

  return (
    <section className='mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6'>
      <h2 className='text-base font-semibold text-slate-900'>Cashflow Timeline</h2>

      <p className='mt-1 text-sm text-slate-500'>Monthly income, outflow, and net cashflow for the scoring window.</p>

      <div className='mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {monthlyCashflow.map((month) => (
          <div key={month.month} className='rounded-lg border border-slate-200 bg-slate-50 p-4'>
            <h3 className='text-sm font-semibold text-slate-800'>{month.month}</h3>

            <div className='mt-4 space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-slate-500'>Income</span>

                <span className='font-medium text-slate-800'>{month.income.toFixed(2)}</span>
              </div>

              <div className='flex justify-between'>
                <span className='text-slate-500'>Outflow</span>

                <span className='font-medium text-slate-800'>{month.outflow.toFixed(2)}</span>
              </div>

              <div className='flex justify-between border-t border-slate-200 pt-2'>
                <span className='font-medium text-slate-700'>Net cashflow</span>

                <span className='font-semibold'>
                  {month.net >= 0 ? '+' : ''}
                  {month.net.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
