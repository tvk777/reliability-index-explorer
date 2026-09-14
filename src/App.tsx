import { useReliability } from './hooks/useReliability';

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
      <h1>Reliability Index</h1>

      <p>Score: {data.reliability_index}</p>
      <p>Band: {data.score_band}</p>
      <p>Currency: {data.currency}</p>
      <p>From: {data.from}</p>
    </main>
  );
}

export default App;
