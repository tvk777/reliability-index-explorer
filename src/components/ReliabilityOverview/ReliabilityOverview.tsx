import type { ReliabilityResponse } from '../../types/reliability';
import { getScoringWindow } from '../../utils/scoringWindow';

type ReliabilityOverviewProps = {
  data: ReliabilityResponse;
};

export const ReliabilityOverview = ({ data }: ReliabilityOverviewProps) => {
  const scoringWindow = getScoringWindow(data.from);
  return (
    <section className='rounded-2xl bg-white p-6 shadow-sm'>
      <h2 className='text-2xl font-semibold text-slate-900'>Reliability Overview</h2>

      <p className='mt-1 text-sm text-slate-500'>Overall financial reliability based on transaction history.</p>

      <div className='mt-6 grid gap-8 md:grid-cols-[auto_1fr_auto] md:items-center'>
        {/* Score */}
        <div className='flex h-40 w-40 flex-col items-center justify-center rounded-full border-12 border-emerald-500'>
          <span className='text-4xl font-bold text-slate-900'>{data.reliability_index}</span>

          <span className='text-sm text-slate-500'>out of 100</span>
        </div>

        {/* Score description */}
        <div>
          <span className='inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800'>
            {data.score_band}
          </span>

          <p className='mt-4 max-w-md text-slate-600'>
            The reliability score reflects income consistency, essential payment behavior, and financial resilience.
          </p>
        </div>

        {/* Details */}
        <div className='border-t border-slate-200 pt-4 md:border-l md:border-t-0 md:pl-8 md:pt-0'>
          <div>
            <p className='text-xs font-medium uppercase tracking-wide text-slate-400'>User ID</p>
            <p className='mt-1 font-medium text-slate-900'>{data.user_id}</p>
          </div>

          <div className='mt-4'>
            <p className='text-xs font-medium uppercase tracking-wide text-slate-400'>Scoring window</p>
            <p className='mt-1 font-medium text-slate-900'>
              {scoringWindow.start} – {scoringWindow.end}
            </p>
          </div>

          <div className='mt-4'>
            <p className='text-xs font-medium uppercase tracking-wide text-slate-400'>Currency</p>
            <p className='mt-1 font-medium text-slate-900'>{data.currency}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
