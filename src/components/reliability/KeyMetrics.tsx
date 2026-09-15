import type { ReliabilityMetrics } from '../../types/reliability';

type KeyMetricsProps = {
  metrics: ReliabilityMetrics;
};

const metricDescriptions = {
  income_regularity: 'Months with income during the 6-month scoring window.',
  income_coverage_ratio: 'Total income compared with total essential expenses.',
  essential_payments_consistency: 'Consistency of essential payment categories across months.',
  good_months: 'Months where income exceeded essential expenses.',
  negative_balance_days: 'Estimated days with a negative running balance.',
  late_fee_events: 'Late fee transactions detected during the scoring window.',
};

export const KeyMetrics = ({ metrics }: KeyMetricsProps) => {
  return (
    <section className='rounded-2xl bg-white p-6 shadow-sm'>
      <h2 className='text-2xl font-semibold text-slate-900'>Key Metrics</h2>

      <p className='mt-1 text-sm text-slate-500'>Core factors that influence the reliability index.</p>

      <div className='mt-6 divide-y divide-slate-100'>
        <div className='flex items-center justify-between py-4 first:pt-0'>
          <div>
            <p className='text-sm font-medium text-slate-700'>Income regularity</p>

            <p className='mt-1 text-xs text-slate-500'>{metricDescriptions.income_regularity}</p>
          </div>

          <p className='ml-4 text-xl font-semibold text-slate-900'>{metrics.income_regularity.toFixed(2)}</p>
        </div>

        <div className='flex items-center justify-between py-4'>
          <div>
            <p className='text-sm font-medium text-slate-700'>Income coverage ratio</p>

            <p className='mt-1 text-xs text-slate-500'>{metricDescriptions.income_coverage_ratio}</p>
          </div>

          <p className='ml-4 text-xl font-semibold text-slate-900'>{metrics.income_coverage_ratio.toFixed(2)}×</p>
        </div>

        <div className='flex items-center justify-between py-4'>
          <div>
            <p className='text-sm font-medium text-slate-700'>Essential payments consistency</p>

            <p className='mt-1 text-xs text-slate-500'>{metricDescriptions.essential_payments_consistency}</p>
          </div>

          <p className='ml-4 text-xl font-semibold text-slate-900'>
            {metrics.essential_payments_consistency.toFixed(2)}
          </p>
        </div>

        <div className='flex items-center justify-between py-4'>
          <div>
            <p className='text-sm font-medium text-slate-700'>Good months</p>

            <p className='mt-1 text-xs text-slate-500'>{metricDescriptions.good_months}</p>
          </div>

          <p className='ml-4 text-xl font-semibold text-slate-900'>{metrics.good_months}</p>
        </div>

        <div className='flex items-center justify-between py-4'>
          <div>
            <p className='text-sm font-medium text-slate-700'>Negative balance days</p>

            <p className='mt-1 text-xs text-slate-500'>{metricDescriptions.negative_balance_days}</p>
          </div>

          <p className='ml-4 text-xl font-semibold text-slate-900'>{metrics.negative_balance_days}</p>
        </div>

        <div className='flex items-center justify-between py-4 last:pb-0'>
          <div>
            <p className='text-sm font-medium text-slate-700'>Late fee events</p>

            <p className='mt-1 text-xs text-slate-500'>{metricDescriptions.late_fee_events}</p>
          </div>

          <p className='ml-4 text-xl font-semibold text-slate-900'>{metrics.late_fee_events}</p>
        </div>
      </div>
    </section>
  );
};
