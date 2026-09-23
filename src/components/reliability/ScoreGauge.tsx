type ScoreGaugeProps = {
  score: number;
};

export const ScoreGauge = ({ score }: ScoreGaugeProps) => {
  const normalizedScore = Math.min(100, Math.max(0, score));

  return (
    <div className='relative h-40 w-40'>
      <div
        className='h-full w-full rounded-full'
        style={{
          background: `conic-gradient(
            #10b981 ${normalizedScore}%,
            #e2e8f0 ${normalizedScore}% 100%
          )`,
        }}
      >
        <div className='absolute inset-3 flex flex-col items-center justify-center rounded-full bg-white'>
          <span className='text-4xl font-bold text-slate-900'>{score}</span>

          <span className='text-sm text-slate-500'>out of 100</span>
        </div>
      </div>
    </div>
  );
};
