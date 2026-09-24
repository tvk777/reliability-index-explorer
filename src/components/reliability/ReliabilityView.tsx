import { AlertCircle } from 'lucide-react';

import { useReliability } from '../../hooks/useReliability';
import type { ScoringWindow } from '../../utils/scoringWindow';

import { ReliabilityOverview } from './ReliabilityOverview';
import { KeyMetrics } from './KeyMetrics';
import { ScoreDrivers } from './ScoreDrivers';
import { ScoreBreakdown } from './ScoreBreakdown';

type ReliabilityViewProps = {
  userId: string;
  scoringWindow: ScoringWindow;
};

const SkeletonCard = ({ className = '' }: { className?: string }) => (
  <div className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 ${className}`}>
    <div className='animate-pulse space-y-4'>
      <div className='h-4 w-32 rounded bg-slate-200' />
      <div className='h-3 w-48 rounded bg-slate-200' />
      <div className='space-y-2 pt-2'>
        <div className='h-3 w-full rounded bg-slate-200' />
        <div className='h-3 w-5/6 rounded bg-slate-200' />
        <div className='h-3 w-2/3 rounded bg-slate-200' />
      </div>
    </div>
  </div>
);

export const ReliabilityView = ({ userId, scoringWindow }: ReliabilityViewProps) => {
  const { data: reliability, isPending, isError, error, refetch } = useReliability(userId, scoringWindow.end);

  if (isPending) {
    return (
      <section>
        <SkeletonCard />

        <div className='mt-6 grid gap-6 lg:grid-cols-5'>
          <SkeletonCard className='lg:col-span-3' />
          <SkeletonCard className='lg:col-span-2' />
        </div>

        <SkeletonCard className='mt-6' />
      </section>
    );
  }

  if (isError) {
    return (
      <section className='rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6'>
        <div className='flex items-start gap-3'>
          <AlertCircle className='mt-0.5 h-5 w-5 shrink-0 text-red-600' aria-hidden='true' />

          <div>
            <p className='text-sm font-semibold text-slate-900'>Failed to load reliability data</p>

            <p className='mt-1 text-sm text-slate-600'>{error.message}</p>

            <button
              type='button'
              onClick={() => refetch()}
              className='mt-3 cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50'
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <ReliabilityOverview data={reliability} />

      <div className='mt-6 grid gap-6 lg:grid-cols-5'>
        <div className='lg:col-span-3'>
          <KeyMetrics metrics={reliability.metrics} />
        </div>

        <div className='lg:col-span-2'>
          <ScoreDrivers drivers={reliability.drivers} />
        </div>
      </div>

      <ScoreBreakdown data={reliability} />
    </section>
  );
};
