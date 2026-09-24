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

export const ReliabilityView = ({ userId, scoringWindow }: ReliabilityViewProps) => {
  const { data: reliability, isPending, isError, error } = useReliability(userId, scoringWindow.end);

  if (isPending) {
    return (
      <section className='rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6'>
        <p className='text-sm text-slate-500'>Loading reliability data...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className='rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6'>
        <p className='text-sm text-red-600'>Error loading reliability: {error.message}</p>
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
