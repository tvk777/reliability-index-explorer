import type { ScoreBand } from '../../types/reliability';

type ScoreGaugeProps = {
  score: number;
  band: ScoreBand;
};

const BAND_ARC_COLOR: Record<ScoreBand, string> = {
  HIGH: '#059669',
  MEDIUM: '#d97706',
  LOW: '#dc2626',
};

const GAUGE_TRACK_COLOR = '#e2e8f0';

export const ScoreGauge = ({ score, band }: ScoreGaugeProps) => {
  const normalizedScore = Math.min(100, Math.max(0, score));

  return (
    <div
      className='relative h-40 w-40'
      role='img'
      aria-label={`Reliability index ${score} out of 100. Score band: ${band}.`}
    >
      <div
        className='h-full w-full rounded-full'
        style={{
          background: `conic-gradient(
            ${BAND_ARC_COLOR[band]} ${normalizedScore}%,
            ${GAUGE_TRACK_COLOR} ${normalizedScore}% 100%
          )`,
        }}
      >
        <div className='absolute inset-3 flex flex-col items-center justify-center rounded-full bg-white'>
          <span className='text-4xl font-semibold tabular-nums text-slate-900'>{score}</span>

          <span className='text-sm text-slate-500'>out of 100</span>
        </div>
      </div>
    </div>
  );
};
