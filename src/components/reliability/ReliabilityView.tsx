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
      <section className='rounded-2xl bg-white p-6 shadow-sm'>
        <p className='text-sm text-slate-500'>Loading reliability data...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className='rounded-2xl bg-white p-6 shadow-sm'>
        <p className='text-sm text-red-600'>Error loading reliability: {error.message}</p>
      </section>
    );
  }

  return (
    <section>
      <ReliabilityOverview data={reliability} scoringWindow={scoringWindow} />

      <div className='mt-6 grid gap-6 lg:grid-cols-2'>
        <KeyMetrics metrics={reliability.metrics} />
        <ScoreDrivers drivers={reliability.drivers} />
      </div>

      <ScoreBreakdown data={reliability} />
    </section>
  );
};
