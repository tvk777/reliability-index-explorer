import type { ReliabilityResponse, ScoreBand } from '../../types/reliability';
import { parseScoreDrivers } from '../../utils/scoreDrivers';

type ScoreBreakdownProps = {
  data: ReliabilityResponse;
};

const SCORING_MONTHS = 6;
const MAX_SIGNAL_POINTS = 25;
const MIN_RESILIENCE_POINTS = -20;
const MAX_RESILIENCE_POINTS = 25;

/** Display-only scale for the coverage bar. 1.00x is breakeven; the bar is capped at 2.00x. */
const COVERAGE_BAR_MAX = 2;

const BAND_CARD: Record<ScoreBand, string> = {
  HIGH: 'border-emerald-200 bg-emerald-50',
  MEDIUM: 'border-amber-200 bg-amber-50',
  LOW: 'border-red-200 bg-red-50',
};

const BAND_BADGE: Record<ScoreBand, string> = {
  HIGH: 'border-emerald-200 bg-white text-emerald-700',
  MEDIUM: 'border-amber-200 bg-white text-amber-700',
  LOW: 'border-red-200 bg-white text-red-700',
};

type EquationOperatorProps = {
  symbol: string;
  /** Read by screen readers in place of the symbol. */
  label: string;
};

/**
 * Renders the operator between two signals. Stacked layouts show it as a centered
 * chip between two hairlines; the xl equation row shows the bare symbol.
 */
const EquationOperator = ({ symbol, label }: EquationOperatorProps) => (
  <div className='flex items-center justify-center gap-3'>
    <span className='h-px flex-1 bg-slate-200 xl:hidden' aria-hidden='true' />

    <span
      className='flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-400 xl:h-auto xl:w-auto xl:border-0 xl:bg-transparent xl:text-2xl xl:text-slate-300'
      aria-hidden='true'
    >
      {symbol}
    </span>

    <span className='sr-only'>{label}</span>

    <span className='h-px flex-1 bg-slate-200 xl:hidden' aria-hidden='true' />
  </div>
);

type MetricBarProps = {
  /** Fill percentage, 0-100. */
  percent: number;
  caption: string;
};

const MetricBar = ({ percent, caption }: MetricBarProps) => {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div className='mt-3'>
      <div className='h-1.5 w-full overflow-hidden rounded-full bg-slate-200' aria-hidden='true'>
        <div className='h-full rounded-full bg-slate-400' style={{ width: `${clamped}%` }} />
      </div>

      <p className='mt-1.5 text-xs text-slate-500'>{caption}</p>
    </div>
  );
};

/**
 * Coverage ratio on a fixed 0.00x - 2.00x display scale with a breakeven marker at 1.00x.
 * Ratios above the scale are clamped to full width and called out in the caption.
 */
const CoverageBar = ({ ratio }: { ratio: number }) => {
  const breakevenPercent = (1 / COVERAGE_BAR_MAX) * 100;

  const fillPercent = Math.min(100, Math.max(0, (ratio / COVERAGE_BAR_MAX) * 100));

  const isCapped = ratio > COVERAGE_BAR_MAX;

  const status = ratio < 1 ? 'below the 1.00× breakeven' : 'above the 1.00× breakeven';

  return (
    <div className='mt-3'>
      <div
        className='relative flex h-3 w-full items-center'
        role='img'
        aria-label={
          `Income coverage ${ratio.toFixed(2)}×, ${status}. ` +
          `Shown on a 0.00× to ${COVERAGE_BAR_MAX.toFixed(2)}× display scale with a breakeven marker at 1.00×` +
          `${isCapped ? ', capped at the top of the scale' : ''}. ` +
          `This bar shows the metric value, not score points.`
        }
      >
        <div className='h-1.5 w-full overflow-hidden rounded-full bg-slate-200'>
          <div className='h-full rounded-full bg-slate-400' style={{ width: `${fillPercent}%` }} />
        </div>

        <span
          className='absolute top-0 h-3 w-0.5 -translate-x-1/2 rounded-full bg-slate-600'
          style={{ left: `${breakevenPercent}%` }}
          aria-hidden='true'
        />
      </div>

      <div className='mt-1 flex justify-between text-xs text-slate-400' aria-hidden='true'>
        <span className='tabular-nums'>0.00×</span>

        <span className='tabular-nums'>1.00× breakeven</span>

        <span className='tabular-nums'>
          {COVERAGE_BAR_MAX.toFixed(2)}×{isCapped ? '+' : ''}
        </span>
      </div>

      <p className='mt-1.5 text-xs text-slate-500'>
        <span className='tabular-nums'>{ratio.toFixed(2)}×</span> — {status}.
        {isCapped ? ` Display scale capped at ${COVERAGE_BAR_MAX.toFixed(2)}×.` : ''} Metric value, not score points.
      </p>
    </div>
  );
};

export const ScoreBreakdown = ({ data }: ScoreBreakdownProps) => {
  const { metrics, drivers } = data;

  const resilienceDrivers = parseScoreDrivers(drivers);

  const netAdjustment = resilienceDrivers.reduce((total, driver) => total + driver.points, 0);

  const incomeMonths = Math.round(metrics.income_regularity * SCORING_MONTHS);

  const paymentConsistency = Math.round(metrics.essential_payments_consistency * 100);

  const incomeRegularityPercent = metrics.income_regularity * 100;

  return (
    <section className='mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6'>
      <h2 className='text-base font-semibold text-slate-900'>Score Breakdown</h2>

      <p className='mt-1 text-sm text-slate-500'>How the four signals influence the reliability assessment.</p>

      <div className='mt-6 grid gap-4 xl:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] xl:items-stretch'>
        {/* Income Regularity */}
        <div className='rounded-lg border border-slate-200 bg-slate-50 p-4'>
          <h3 className='text-sm font-semibold text-slate-800'>Income Regularity</h3>

          <p className='mt-3 text-2xl font-semibold tabular-nums text-slate-900'>
            {incomeMonths} / {SCORING_MONTHS} months
          </p>

          <MetricBar
            percent={incomeRegularityPercent}
            caption={`Metric value: ${metrics.income_regularity.toFixed(2)} of 1.00 — not score points.`}
          />

          <p className='mt-3 text-sm text-slate-600'>
            Income was present in {incomeMonths} of the {SCORING_MONTHS} scoring months.
          </p>

          <p className='mt-4 text-xs text-slate-400'>Maximum contribution: {MAX_SIGNAL_POINTS} points</p>
        </div>

        <EquationOperator symbol='+' label='plus' />

        {/* Income Coverage Ratio */}
        <div className='rounded-lg border border-slate-200 bg-slate-50 p-4'>
          <h3 className='text-sm font-semibold text-slate-800'>Income Coverage Ratio</h3>

          <p className='mt-3 text-2xl font-semibold tabular-nums text-slate-900'>
            {metrics.income_coverage_ratio.toFixed(2)}×
          </p>

          <CoverageBar ratio={metrics.income_coverage_ratio} />

          <p className='mt-3 text-sm text-slate-600'>Total income compared with total essential expenses.</p>

          <p className='mt-4 text-xs text-slate-400'>Maximum contribution: {MAX_SIGNAL_POINTS} points</p>
        </div>

        <EquationOperator symbol='+' label='plus' />

        {/* Essential Payments Consistency */}
        <div className='rounded-lg border border-slate-200 bg-slate-50 p-4'>
          <h3 className='text-sm font-semibold text-slate-800'>Essential Payments Consistency</h3>

          <p className='mt-3 text-2xl font-semibold tabular-nums text-slate-900'>{paymentConsistency}%</p>

          <MetricBar
            percent={paymentConsistency}
            caption={`Metric value: ${metrics.essential_payments_consistency.toFixed(2)} of 1.00 — not score points.`}
          />

          <p className='mt-3 text-sm text-slate-600'>
            Essential payment categories were detected consistently across months.
          </p>

          <p className='mt-4 text-xs text-slate-400'>Maximum contribution: {MAX_SIGNAL_POINTS} points</p>
        </div>

        <EquationOperator symbol='+' label='plus' />

        {/* Resilience Adjustments */}
        <div className='rounded-lg border border-slate-200 bg-slate-50 p-4'>
          <h3 className='text-sm font-semibold text-slate-800'>Resilience Adjustments</h3>

          {resilienceDrivers.length > 0 ? (
            <div className='mt-3 space-y-2'>
              {resilienceDrivers.map((driver) => (
                <p key={driver.text} className='text-sm text-slate-600'>
                  {driver.text}
                </p>
              ))}

              <p className='mt-4 border-t border-slate-200 pt-3 text-sm font-medium text-slate-700'>
                Net adjustment:{' '}
                <span
                  className={`font-semibold tabular-nums ${
                    netAdjustment > 0 ? 'text-emerald-700' : netAdjustment < 0 ? 'text-red-700' : 'text-slate-700'
                  }`}
                >
                  {netAdjustment > 0 ? '+' : ''}
                  {netAdjustment} pts
                </span>
              </p>
            </div>
          ) : (
            <p className='mt-3 text-sm text-slate-500'>No resilience adjustments reported.</p>
          )}

          <p className='mt-4 text-xs text-slate-400'>
            Adjustment range: {MIN_RESILIENCE_POINTS} to +{MAX_RESILIENCE_POINTS} points
          </p>
        </div>

        <EquationOperator symbol='→' label='results in' />

        {/* Final Score */}
        <div className={`flex flex-col justify-center rounded-lg border p-4 ${BAND_CARD[data.score_band]}`}>
          <h3 className='text-sm font-semibold text-slate-800'>Final Reliability Index</h3>

          <p className='mt-3 flex items-baseline gap-1.5 whitespace-nowrap'>
            <span className='text-4xl font-semibold tabular-nums text-slate-900'>{data.reliability_index}</span>

            <span className='text-lg font-medium tabular-nums text-slate-500'>/ 100</span>
          </p>

          <span
            className={`mt-3 inline-flex w-fit rounded-md border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${
              BAND_BADGE[data.score_band]
            }`}
          >
            {data.score_band}
          </span>
        </div>
      </div>
    </section>
  );
};
