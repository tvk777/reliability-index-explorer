import { AlertTriangle, CalendarCheck, Repeat, Scale, TrendingDown, TrendingUp } from 'lucide-react';

import type { ReliabilityMetrics } from '../../types/reliability';

type KeyMetricsProps = {
  metrics: ReliabilityMetrics;
};

/** Display-only scale for the coverage bar. 1.00x is breakeven; the bar is capped at 2.00x. */
const COVERAGE_BAR_MAX = 2;

const metricDescriptions = {
  income_regularity: 'Months with income during the 6-month scoring window.',
  income_coverage_ratio: 'Total income compared with total essential expenses.',
  essential_payments_consistency: 'Consistency of essential payment categories across months.',
  good_months: 'Months where income exceeded essential expenses.',
  negative_balance_days: 'Estimated days with a negative running balance.',
  late_fee_events: 'Late fee transactions detected during the scoring window.',
};

const ICON_CHIP = 'mt-0.5 shrink-0 rounded-md p-1.5';

const MetricBar = ({ percent }: { percent: number }) => {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div className='mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100' aria-hidden='true'>
      <div className='h-full rounded-full bg-slate-400' style={{ width: `${clamped}%` }} />
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
    <>
      <div
        className='relative mt-2 flex h-3 w-full items-center'
        role='img'
        aria-label={
          `Income coverage ${ratio.toFixed(2)}×, ${status}. ` +
          `Shown on a 0.00× to ${COVERAGE_BAR_MAX.toFixed(2)}× display scale with a breakeven marker at 1.00×` +
          `${isCapped ? ', capped at the top of the scale' : ''}. ` +
          `This bar shows the metric value, not score points.`
        }
      >
        <div className='h-1.5 w-full overflow-hidden rounded-full bg-slate-100'>
          <div className='h-full rounded-full bg-slate-400' style={{ width: `${fillPercent}%` }} />
        </div>

        <span
          className='absolute top-0 h-3 w-0.5 -translate-x-1/2 rounded-full bg-slate-600'
          style={{ left: `${breakevenPercent}%` }}
          aria-hidden='true'
        />
      </div>

      <p className='mt-1 text-xs text-slate-400' aria-hidden='true'>
        <span className='tabular-nums'>1.00×</span> breakeven · display scale to{' '}
        <span className='tabular-nums'>{COVERAGE_BAR_MAX.toFixed(2)}×</span>
        {isCapped ? ' (capped)' : ''}
      </p>
    </>
  );
};

export const KeyMetrics = ({ metrics }: KeyMetricsProps) => {
  const hasNegativeBalanceDays = metrics.negative_balance_days > 0;

  const hasLateFeeEvents = metrics.late_fee_events > 0;

  return (
    <section className='rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6'>
      <h2 className='text-base font-semibold text-slate-900'>Key Metrics</h2>

      <p className='mt-1 text-sm text-slate-500'>Core factors that influence the reliability index.</p>

      <div className='mt-6 divide-y divide-slate-100'>
        <div className='flex items-start gap-3 py-4 first:pt-0'>
          <span className={`${ICON_CHIP} bg-slate-100 text-slate-600`}>
            <Repeat className='h-4 w-4' aria-hidden='true' />
          </span>

          <div className='min-w-0 flex-1'>
            <div className='flex items-baseline justify-between gap-4'>
              <p className='text-sm font-medium text-slate-700'>Income regularity</p>

              <p className='shrink-0 text-xl font-semibold tabular-nums text-slate-900'>
                {metrics.income_regularity.toFixed(2)}
              </p>
            </div>

            <p className='mt-1 text-xs text-slate-500'>{metricDescriptions.income_regularity}</p>

            <MetricBar percent={metrics.income_regularity * 100} />
          </div>
        </div>

        <div className='flex items-start gap-3 py-4'>
          <span className={`${ICON_CHIP} bg-slate-100 text-slate-600`}>
            <Scale className='h-4 w-4' aria-hidden='true' />
          </span>

          <div className='min-w-0 flex-1'>
            <div className='flex items-baseline justify-between gap-4'>
              <p className='text-sm font-medium text-slate-700'>Income coverage ratio</p>

              <p className='shrink-0 text-xl font-semibold tabular-nums text-slate-900'>
                {metrics.income_coverage_ratio.toFixed(2)}×
              </p>
            </div>

            <p className='mt-1 text-xs text-slate-500'>{metricDescriptions.income_coverage_ratio}</p>

            <CoverageBar ratio={metrics.income_coverage_ratio} />
          </div>
        </div>

        <div className='flex items-start gap-3 py-4'>
          <span className={`${ICON_CHIP} bg-slate-100 text-slate-600`}>
            <CalendarCheck className='h-4 w-4' aria-hidden='true' />
          </span>

          <div className='min-w-0 flex-1'>
            <div className='flex items-baseline justify-between gap-4'>
              <p className='text-sm font-medium text-slate-700'>Essential payments consistency</p>

              <p className='shrink-0 text-xl font-semibold tabular-nums text-slate-900'>
                {metrics.essential_payments_consistency.toFixed(2)}
              </p>
            </div>

            <p className='mt-1 text-xs text-slate-500'>{metricDescriptions.essential_payments_consistency}</p>

            <MetricBar percent={metrics.essential_payments_consistency * 100} />
          </div>
        </div>

        <div className='flex items-start gap-3 py-4'>
          <span className={`${ICON_CHIP} bg-slate-100 text-slate-600`}>
            <TrendingUp className='h-4 w-4' aria-hidden='true' />
          </span>

          <div className='min-w-0 flex-1'>
            <div className='flex items-baseline justify-between gap-4'>
              <p className='text-sm font-medium text-slate-700'>Good months</p>

              <p className='shrink-0 text-xl font-semibold tabular-nums text-slate-900'>{metrics.good_months}</p>
            </div>

            <p className='mt-1 text-xs text-slate-500'>{metricDescriptions.good_months}</p>
          </div>
        </div>

        <div className='flex items-start gap-3 py-4'>
          <span
            className={`${ICON_CHIP} ${hasNegativeBalanceDays ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'}`}
          >
            <TrendingDown className='h-4 w-4' aria-hidden='true' />
          </span>

          <div className='min-w-0 flex-1'>
            <div className='flex items-baseline justify-between gap-4'>
              <p className='text-sm font-medium text-slate-700'>Negative balance days</p>

              <p
                className={`shrink-0 text-xl font-semibold tabular-nums ${
                  hasNegativeBalanceDays ? 'text-red-600' : 'text-slate-900'
                }`}
              >
                {metrics.negative_balance_days}
              </p>
            </div>

            <p className='mt-1 text-xs text-slate-500'>{metricDescriptions.negative_balance_days}</p>
          </div>
        </div>

        <div className='flex items-start gap-3 py-4 last:pb-0'>
          <span className={`${ICON_CHIP} ${hasLateFeeEvents ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
            <AlertTriangle className='h-4 w-4' aria-hidden='true' />
          </span>

          <div className='min-w-0 flex-1'>
            <div className='flex items-baseline justify-between gap-4'>
              <p className='text-sm font-medium text-slate-700'>Late fee events</p>

              <p
                className={`shrink-0 text-xl font-semibold tabular-nums ${
                  hasLateFeeEvents ? 'text-red-600' : 'text-slate-900'
                }`}
              >
                {metrics.late_fee_events}
              </p>
            </div>

            <p className='mt-1 text-xs text-slate-500'>{metricDescriptions.late_fee_events}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
