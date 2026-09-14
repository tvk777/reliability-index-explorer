import { useQuery } from '@tanstack/react-query';

function App() {
  const userId = 'user_1001';
  const from = '2026-02-20';

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['reliability', userId, from],

    queryFn: async () => {
      const response = await fetch(
        `https://wydokyegph.execute-api.eu-central-1.amazonaws.com/api/users/${userId}/reliability?from=${from}`,
      );

      if (!response.ok) {
        throw new Error('Failed to fetch reliability data');
      }

      return response.json();
    },

    staleTime: 5 * 60 * 1000,
  });

  if (isPending) {
    return <div className='p-8'>Loading...</div>;
  }

  if (isError) {
    return <div className='p-8 text-red-600'>Error: {error.message}</div>;
  }


  return (
    <div className='min-h-screen bg-slate-100 p-8'>
      <h1 className='text-3xl font-bold text-slate-900'>Reliability Index Explorer</h1>

      <div className='mt-6 rounded-lg bg-white p-6 shadow'>
        <p className='text-slate-600'>Reliability Index</p>

        <p className='mt-2 text-5xl font-bold text-slate-900'>{data.reliability_index}</p>

        <p className='mt-2 text-lg'>{data.score_band}</p>
      </div>
    </div>
  );
}

export default App;
