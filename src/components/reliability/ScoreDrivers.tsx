import { AlertTriangle, CheckCircle2, Circle } from 'lucide-react';

import type { ReliabilityResponse } from '../../types/reliability';
import { parseScoreDrivers } from '../../utils/scoreDrivers';

type ScoreDriversProps = {
  drivers: ReliabilityResponse['drivers'];
};

export const ScoreDrivers = ({ drivers }: ScoreDriversProps) => {
  const parsedDrivers = parseScoreDrivers(drivers);

  const positiveDrivers = parsedDrivers.filter((driver) => driver.points > 0);

  const riskDrivers = parsedDrivers.filter((driver) => driver.points < 0);

  const otherDrivers = drivers.filter((driver) => !parsedDrivers.some((parsedDriver) => parsedDriver.text === driver));

  return (
    <section className='rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6'>
      <h2 className='text-base font-semibold text-slate-900'>Score Drivers</h2>

      <p className='mt-1 text-sm text-slate-500'>Factors reported by the scoring system.</p>

      <div className='mt-6 space-y-4'>
        {/* Positive adjustments */}
        <div className='rounded-lg border border-emerald-200 bg-emerald-50 p-4'>
          <h3 className='text-sm font-semibold text-emerald-800'>Positive adjustments</h3>

          {positiveDrivers.length > 0 ? (
            <ul className='mt-3 space-y-2.5'>
              {positiveDrivers.map((driver) => (
                <li key={driver.text} className='flex items-start gap-2.5 text-sm'>
                  <CheckCircle2 className='mt-0.5 h-4 w-4 shrink-0 text-emerald-600' aria-hidden='true' />

                  <span className='min-w-0 flex-1 text-slate-700'>{driver.text}</span>

                  <span className='w-16 shrink-0 rounded-md border border-emerald-200 bg-white px-1.5 py-0.5 text-center text-xs font-semibold tabular-nums text-emerald-700'>
                    +{driver.points} pts
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className='mt-3 text-sm text-slate-500'>No positive adjustments reported.</p>
          )}
        </div>

        {/* Risk adjustments */}
        <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
          <h3 className='text-sm font-semibold text-red-800'>Risk adjustments</h3>

          {riskDrivers.length > 0 ? (
            <ul className='mt-3 space-y-2.5'>
              {riskDrivers.map((driver) => (
                <li key={driver.text} className='flex items-start gap-2.5 text-sm'>
                  <AlertTriangle className='mt-0.5 h-4 w-4 shrink-0 text-red-600' aria-hidden='true' />

                  <span className='min-w-0 flex-1 text-slate-700'>{driver.text}</span>

                  <span className='w-16 shrink-0 rounded-md border border-red-200 bg-white px-1.5 py-0.5 text-center text-xs font-semibold tabular-nums text-red-700'>
                    {driver.points} pts
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className='mt-3 text-sm text-slate-500'>No risk adjustments reported.</p>
          )}
        </div>

        {/* Other observed drivers */}
        {otherDrivers.length > 0 && (
          <div className='rounded-lg border border-slate-200 bg-slate-50 p-4'>
            <h3 className='text-sm font-semibold text-slate-800'>Other observed drivers</h3>

            <ul className='mt-3 space-y-2.5'>
              {otherDrivers.map((driver) => (
                <li key={driver} className='flex items-start gap-2.5 text-sm'>
                  <Circle className='mt-1 h-2 w-2 shrink-0 fill-slate-400 text-slate-400' aria-hidden='true' />

                  <span className='min-w-0 flex-1 text-slate-700'>{driver}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};
