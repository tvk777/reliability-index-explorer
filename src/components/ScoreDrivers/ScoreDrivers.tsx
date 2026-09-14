import type { ReliabilityResponse } from '../../types/reliability';

type ScoreDriversProps = {
  drivers: ReliabilityResponse['drivers'];
};

export const ScoreDrivers = ({ drivers }: ScoreDriversProps) => {
  return (
    <section className='rounded-2xl bg-white p-6 shadow-sm'>
      <h2 className='text-2xl font-semibold text-slate-900'>Score Drivers</h2>

      <p className='mt-1 text-sm text-slate-500'>Factors contributing to the reliability score.</p>

      <ul className='mt-6 divide-y divide-slate-100'>
        {drivers.map((driver) => (
          <li key={driver} className='py-4 text-sm text-slate-700 first:pt-0 last:pb-0'>
            <span className='mr-2 text-slate-400'>•</span>
            {driver}
          </li>
        ))}
      </ul>
    </section>
  );
};
