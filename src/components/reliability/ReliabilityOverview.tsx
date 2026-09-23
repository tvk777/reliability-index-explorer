import type { ReliabilityResponse } from '../../types/reliability';
import type { ScoringWindow } from '../../utils/scoringWindow';
import { ScoreGauge } from './ScoreGauge';

type ReliabilityOverviewProps = {
  data: ReliabilityResponse;
  scoringWindow: ScoringWindow;
};

export const ReliabilityOverview = ({ data, scoringWindow }: ReliabilityOverviewProps) => {
  return (
    <section className='rounded-2xl bg-white p-6 shadow-sm'>
      <h2 className='text-2xl font-semibold text-slate-900'>Reliability Overview</h2>

      <p className='mt-1 text-sm text-slate-500'>Overall financial reliability based on transaction history.</p>

      <div className='mt-6 grid gap-8 md:grid-cols-[auto_1fr_auto] md:items-center'>
        {/* Score */}
        <ScoreGauge score={data.reliability_index} />

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
