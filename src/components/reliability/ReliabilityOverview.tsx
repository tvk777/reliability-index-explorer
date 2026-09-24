import type { ReliabilityResponse, ScoreBand } from '../../types/reliability';
import { ScoreGauge } from './ScoreGauge';

type ReliabilityOverviewProps = {
  data: ReliabilityResponse;
};

const BAND_BADGE: Record<ScoreBand, string> = {
  HIGH: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  MEDIUM: 'border-amber-200 bg-amber-50 text-amber-700',
  LOW: 'border-red-200 bg-red-50 text-red-700',
};

export const ReliabilityOverview = ({ data }: ReliabilityOverviewProps) => {
  return (
    <section className='rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6'>
      <h2 className='text-base font-semibold text-slate-900'>Reliability Overview</h2>

      <p className='mt-1 text-sm text-slate-500'>Overall financial reliability based on transaction history.</p>

      <div className='mt-6 grid gap-6 md:grid-cols-[auto_1fr] md:items-center lg:grid-cols-[auto_1fr_auto] lg:gap-10'>
        {/* Score */}
        <ScoreGauge score={data.reliability_index} band={data.score_band} />

        {/* Score description */}
        <div>
          <span
            className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${
              BAND_BADGE[data.score_band]
            }`}
          >
            {data.score_band}
          </span>

          <p className='mt-4 max-w-md text-sm text-slate-600'>
            The reliability score reflects income consistency, essential payment behavior, and financial resilience.
          </p>
        </div>

        {/* Details */}
        <div className='border-t border-slate-200 pt-4 md:col-span-2 lg:col-span-1 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0'>
          <div>
            <p className='text-xs font-medium uppercase tracking-wide text-slate-500'>Currency</p>

            <p className='mt-1 text-sm font-medium text-slate-900'>{data.currency}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
