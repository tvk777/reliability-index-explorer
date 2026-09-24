import { useMemo } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import type { Transaction } from '../../types/transaction';
import type { ScoringWindow } from '../../utils/scoringWindow';
import { getMonthlyCashflow } from '../../utils/cashflow';

type CashflowTimelineProps = {
  transactions: Transaction[];
  scoringWindow: ScoringWindow;
};

const formatMonthLabel = (monthKey: string) => {
  const [year, month] = monthKey.split('-').map(Number);

  const date = new Date(Date.UTC(year, month - 1, 1));

  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
};

export const CashflowTimeline = ({ transactions, scoringWindow }: CashflowTimelineProps) => {
  const monthlyCashflow = useMemo(
    () => getMonthlyCashflow(transactions, scoringWindow.start, scoringWindow.end),
    [transactions, scoringWindow],
  );

  const totals = useMemo(
    () =>
      monthlyCashflow.reduce(
        (acc, month) => ({
          income: acc.income + month.income,
          outflow: acc.outflow + month.outflow,
          net: acc.net + month.net,
        }),
        { income: 0, outflow: 0, net: 0 },
      ),
    [monthlyCashflow],
  );

  return (
    <section className='mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6'>
      <h2 className='text-base font-semibold text-slate-900'>Cashflow Timeline</h2>

      <p className='mt-1 text-sm text-slate-500'>Monthly income, outflow, and net cashflow for the scoring window.</p>

      <div className='mt-4 grid grid-cols-1 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-slate-50 text-center sm:grid-cols-3 sm:divide-x sm:divide-y-0'>
        <div className='px-3 py-3'>
          <p className='text-xs font-medium uppercase tracking-wide text-slate-500'>Total income</p>
          <p className='mt-1 text-lg font-semibold tabular-nums text-emerald-600'>+{totals.income.toFixed(2)}</p>
        </div>

        <div className='px-3 py-3'>
          <p className='text-xs font-medium uppercase tracking-wide text-slate-500'>Total outflow</p>
          <p className='mt-1 text-lg font-semibold tabular-nums text-red-600'>-{totals.outflow.toFixed(2)}</p>
        </div>

        <div className='px-3 py-3'>
          <p className='text-xs font-medium uppercase tracking-wide text-slate-500'>Net cashflow</p>
          <p
            className={`mt-1 text-lg font-semibold tabular-nums ${totals.net >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
          >
            {totals.net >= 0 ? '+' : ''}
            {totals.net.toFixed(2)}
          </p>
        </div>
      </div>

      <div className='mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {monthlyCashflow.map((month) => {
          const barMax = Math.max(month.income, month.outflow) || 1;
          const incomeBarWidth = (month.income / barMax) * 100;
          const outflowBarWidth = (month.outflow / barMax) * 100;

          return (
            <div key={month.month} className='rounded-lg border border-slate-200 bg-slate-50 p-4'>
              <h3 className='text-sm font-semibold text-slate-800'>{formatMonthLabel(month.month)}</h3>

              <div className='mt-4 space-y-2 text-sm'>
                <div>
                  <div className='flex items-center justify-between'>
                    <span className='flex items-center gap-1 text-slate-500'>
                      <ArrowUpRight className='h-3.5 w-3.5 text-emerald-600' aria-hidden='true' />
                      Income
                    </span>

                    <span className='font-medium tabular-nums text-slate-800'>{month.income.toFixed(2)}</span>
                  </div>

                  <div className='mt-1 h-1.5 rounded-full bg-slate-200'>
                    <div
                      className='h-1.5 rounded-full bg-emerald-500'
                      style={{ width: `${incomeBarWidth}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className='flex items-center justify-between'>
                    <span className='flex items-center gap-1 text-slate-500'>
                      <ArrowDownRight className='h-3.5 w-3.5 text-red-600' aria-hidden='true' />
                      Outflow
                    </span>

                    <span className='font-medium tabular-nums text-slate-800'>{month.outflow.toFixed(2)}</span>
                  </div>

                  <div className='mt-1 h-1.5 rounded-full bg-slate-200'>
                    <div className='h-1.5 rounded-full bg-red-500' style={{ width: `${outflowBarWidth}%` }} />
                  </div>
                </div>

                <div className='flex justify-between border-t border-slate-200 pt-2'>
                  <span className='font-medium text-slate-700'>Net cashflow</span>

                  <span className={`font-semibold tabular-nums ${month.net >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {month.net >= 0 ? '+' : ''}
                    {month.net.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
