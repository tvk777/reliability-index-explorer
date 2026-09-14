import type { ReliabilityResponse } from '../../types/reliability';

type ScoreBreakdownProps = {
  data: ReliabilityResponse;
};

const getResilienceDrivers = (drivers: string[]) => {
  return drivers
    .filter((driver) => /\([+-]\d+\s*pts?\)/i.test(driver))
    .map((driver) => {
      const match = driver.match(/\(([+-]\d+)\s*pts?\)/i);

      return {
        text: driver,
        points: match ? Number(match[1]) : 0,
      };
    });
};

export const ScoreBreakdown = ({ data }: ScoreBreakdownProps) => {
  const { metrics, drivers } = data;

  const resilienceDrivers = getResilienceDrivers(drivers);

  const netAdjustment = resilienceDrivers.reduce((total, driver) => total + driver.points, 0);

  const incomeMonths = Math.round(metrics.income_regularity * 6);
  const paymentConsistency = Math.round(metrics.essential_payments_consistency * 100);

  return (
    <section className='mt-6 rounded-2xl bg-white p-6 shadow-sm'>
      <h2 className='text-2xl font-semibold text-slate-900'>Score Breakdown</h2>

      <p className='mt-1 text-sm text-slate-500'>How the four signals influence the reliability assessment.</p>

      <div className='mt-6 grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-stretch'>
        {/* Income Regularity */}
        <div className='rounded-xl bg-slate-50 p-5'>
          <h3 className='text-sm font-semibold text-slate-800'>Income Regularity</h3>

          <p className='mt-4 text-2xl font-semibold text-slate-900'>{incomeMonths} / 6 months</p>

          <p className='mt-2 text-sm text-slate-600'>Income was present in {incomeMonths} of the 6 scoring months.</p>

          <p className='mt-5 text-xs text-slate-400'>Maximum contribution: 25 points</p>
        </div>

        {/* Plus */}
        <div className='hidden items-center justify-center text-2xl text-slate-300 lg:flex'>+</div>

        {/* Income Coverage Ratio */}
        <div className='rounded-xl bg-slate-50 p-5'>
          <h3 className='text-sm font-semibold text-slate-800'>Income Coverage Ratio</h3>

          <p className='mt-4 text-2xl font-semibold text-slate-900'>{metrics.income_coverage_ratio.toFixed(2)}×</p>

          <p className='mt-2 text-sm text-slate-600'>Total income compared with total essential expenses.</p>

          <p className='mt-5 text-xs text-slate-400'>Maximum contribution: 25 points</p>
        </div>

        {/* Plus */}
        <div className='hidden items-center justify-center text-2xl text-slate-300 lg:flex'>+</div>

        {/* Essential Payments Consistency */}
        <div className='rounded-xl bg-slate-50 p-5'>
          <h3 className='text-sm font-semibold text-slate-800'>Essential Payments Consistency</h3>

          <p className='mt-4 text-2xl font-semibold text-slate-900'>{paymentConsistency}%</p>

          <p className='mt-2 text-sm text-slate-600'>
            Essential payment categories were detected consistently across months.
          </p>

          <p className='mt-5 text-xs text-slate-400'>Maximum contribution: 25 points</p>
        </div>

        {/* Plus */}
        <div className='hidden items-center justify-center text-2xl text-slate-300 lg:flex'>+</div>

        {/* Resilience Adjustments */}
        <div className='rounded-xl bg-slate-50 p-5'>
          <h3 className='text-sm font-semibold text-slate-800'>Resilience Adjustments</h3>

          <div className='mt-4 space-y-2'>
            {resilienceDrivers.map((driver) => (
              <p key={driver.text} className='text-sm text-slate-600'>
                {driver.text}
              </p>
            ))}
          </div>

          {resilienceDrivers.length > 0 && (
            <p className='mt-4 border-t border-slate-200 pt-3 text-sm font-medium text-slate-700'>
              Net adjustment: {netAdjustment > 0 ? '+' : ''}
              {netAdjustment} pts
            </p>
          )}

          <p className='mt-3 text-xs text-slate-400'>Adjustment range: −20 to +25 points</p>
        </div>

        {/* Arrow */}
        <div className='hidden items-center justify-center text-2xl text-slate-300 lg:flex'>→</div>

        {/* Final Score */}
        <div className='rounded-xl border border-slate-200 p-5'>
          <h3 className='text-sm font-semibold text-slate-800'>Final Reliability Index</h3>

          <p className='mt-4 text-3xl font-semibold text-slate-900'>{data.reliability_index} / 100</p>

          <p className='mt-3 inline-block rounded-lg bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700'>
            {data.score_band}
          </p>
        </div>
      </div>
    </section>
  );
};
