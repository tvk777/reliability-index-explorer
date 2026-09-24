import { useState } from 'react';
import { ReliabilityView } from './components/reliability/ReliabilityView';
import { TransactionsView } from './components/transactions/TransactionsView';
import { getScoringWindow } from './utils/scoringWindow';

const AVAILABLE_USER_IDS = Array.from({ length: 10 }, (_, index) => `user_${1001 + index}`);

const getTodayDate = () => {
  const now = new Date();

  return [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join(
    '-',
  );
};

export const App = () => {
  const [selectedUserId, setSelectedUserId] = useState('user_1001');
  const [selectedDate, setSelectedDate] = useState(getTodayDate);

  const scoringWindow = getScoringWindow(selectedDate);

  return (
    <div className='min-h-screen bg-slate-50'>
      <main className='mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8'>
        <header className='flex flex-wrap items-end justify-between gap-4'>
          <h1 className='text-xl font-semibold text-slate-900'>Reliability Index Explorer</h1>

          <div className='flex flex-wrap items-start gap-x-8 gap-y-3'>
            <div>
              <label htmlFor='user-select' className='text-xs font-medium uppercase tracking-wide text-slate-500'>
                User
              </label>

              <select
                id='user-select'
                value={selectedUserId}
                onChange={(event) => setSelectedUserId(event.target.value)}
                className='mt-1 block rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-300'
              >
                {AVAILABLE_USER_IDS.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor='as-of-date' className='text-xs font-medium uppercase tracking-wide text-slate-500'>
                As of date
              </label>

              <input
                id='as-of-date'
                type='date'
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className='mt-1 block rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium tabular-nums text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-300'
              />
            </div>

            <div>
              <p className='text-xs font-medium uppercase tracking-wide text-slate-500'>Scoring window</p>

              <p className='mt-1 py-2 text-sm font-medium tabular-nums text-slate-900'>
                {scoringWindow.start} – {scoringWindow.end}
              </p>
            </div>
          </div>
        </header>

        <div className='mt-6'>
          <ReliabilityView userId={selectedUserId} scoringWindow={scoringWindow} />
          <TransactionsView userId={selectedUserId} scoringWindow={scoringWindow} />
        </div>
      </main>
    </div>
  );
};
