import { useReliability } from './hooks/useReliability';
import { ReliabilityOverview } from './components/ReliabilityOverview/ReliabilityOverview';
import { ScoreBreakdown } from './components/ScoreBreakdown/ScoreBreakdown';
import { KeyMetrics } from './components/KeyMetrics/KeyMetrics';
import { ScoreDrivers } from './components/ScoreDrivers/ScoreDrivers';

function App() {
  const userId = 'user_1001';
  const from = '2026-02-20';

  const { data, isPending, isError, error } = useReliability(userId, from)

  if (isPending) {
    return <div className='p-8'>Loading...</div>;
  }

  if (isError) {
    return <div className='p-8 text-red-600'>Error: {error.message}</div>;
  }


  return (
    <main>
      <ReliabilityOverview data={data} />

      <div className='mt-6 grid gap-6 lg:grid-cols-2'>
        <KeyMetrics metrics={data.metrics} />
        <ScoreDrivers drivers={data.drivers} />
      </div>

      <ScoreBreakdown data={data} />
    </main>
  );
}

export default App;
