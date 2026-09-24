import { ReliabilityView } from './components/reliability/ReliabilityView';
import { TransactionsView } from './components/transactions/TransactionsView';
import { getScoringWindow } from './utils/scoringWindow';



export const App = () => {
  const userId = 'user_1001';
  const endDate = '2026-09-26';

  const scoringWindow = getScoringWindow(endDate);


  return (
    <div className='min-h-screen bg-slate-50'>
      <main className='mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8'>
        <header className='flex flex-wrap items-end justify-between gap-4'>
          <h1 className='text-xl font-semibold text-slate-900'>Reliability Index Explorer</h1>

          <div className='flex flex-wrap items-start gap-x-8 gap-y-3'>
            <div>
              <p className='text-xs font-medium uppercase tracking-wide text-slate-500'>User ID</p>

              <p className='mt-1 text-sm font-medium tabular-nums text-slate-900'>{userId}</p>
            </div>

            <div>
              <p className='text-xs font-medium uppercase tracking-wide text-slate-500'>Scoring window</p>

              <p className='mt-1 text-sm font-medium tabular-nums text-slate-900'>
                {scoringWindow.start} – {scoringWindow.end}
              </p>
            </div>
          </div>
        </header>

        <div className='mt-6'>
          <ReliabilityView userId={userId} scoringWindow={scoringWindow} />
          <TransactionsView userId={userId} scoringWindow={scoringWindow} />
        </div>
      </main>
    </div>
  );
};
