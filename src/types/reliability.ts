export type ScoreBand = 'LOW' | 'MEDIUM' | 'HIGH';

export type ReliabilityMetrics = {
  income_regularity: number;
  income_coverage_ratio: number;
  essential_payments_consistency: number;
  good_months: number;
  negative_balance_days: number;
  late_fee_events: number;
};

export type ReliabilityResponse = {
  user_id: string;
  from: string;
  currency: string;
  reliability_index: number;
  score_band: ScoreBand;
  metrics: ReliabilityMetrics;
  drivers: string[];
};
