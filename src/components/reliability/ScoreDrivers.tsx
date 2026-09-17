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
    <section className='rounded-2xl bg-white p-6 shadow-sm'>
      <h2 className='text-2xl font-semibold text-slate-900'>Score Drivers</h2>

      <p className='mt-1 text-sm text-slate-500'>Factors reported by the scoring system.</p>

      <div className='mt-6 grid gap-6 lg:grid-cols-2'>
        {/* Positive adjustments */}
        <div className='rounded-xl bg-emerald-50 p-5'>
          <h3 className='text-lg font-semibold text-emerald-800'>Positive adjustments</h3>

          {positiveDrivers.length > 0 ? (
            <ul className='mt-4 space-y-3'>
              {positiveDrivers.map((driver) => (
                <li key={driver.text} className='flex items-start justify-between gap-4 text-sm'>
                  <span className='text-slate-700'>✓ {driver.text}</span>

                  <span className='shrink-0 font-semibold text-emerald-700'>+{driver.points} pts</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className='mt-4 text-sm text-slate-500'>No positive adjustments reported.</p>
          )}
        </div>

        {/* Risk adjustments */}
        <div className='rounded-xl bg-rose-50 p-5'>
          <h3 className='text-lg font-semibold text-rose-800'>Risk adjustments</h3>

          {riskDrivers.length > 0 ? (
            <ul className='mt-4 space-y-3'>
              {riskDrivers.map((driver) => (
                <li key={driver.text} className='flex items-start justify-between gap-4 text-sm'>
                  <span className='text-slate-700'>! {driver.text}</span>

                  <span className='shrink-0 font-semibold text-rose-700'>{driver.points} pts</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className='mt-4 text-sm text-slate-500'>No risk adjustments reported.</p>
          )}
        </div>
      </div>

      {/* Other observed drivers */}
      {otherDrivers.length > 0 && (
        <div className='mt-6 rounded-xl bg-slate-50 p-5'>
          <h3 className='text-lg font-semibold text-slate-800'>Other observed drivers</h3>

          <ul className='mt-4 space-y-3'>
            {otherDrivers.map((driver) => (
              <li key={driver} className='text-sm text-slate-700'>
                <span className='mr-2 text-slate-400'>•</span>
                {driver}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};
