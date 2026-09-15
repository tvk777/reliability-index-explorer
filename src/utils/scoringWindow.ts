export type ScoringWindow = {
  start: string;
  end: string;
};

const MONTHS_IN_SCORING_WINDOW = 6;

export const getScoringWindow = (from: string): ScoringWindow => {
  const [year, month] = from.split('-').map(Number);
  const startMonthIndex = month - 1 - (MONTHS_IN_SCORING_WINDOW - 1);

  const startDate = new Date(Date.UTC(year, startMonthIndex, 1));

  const start = [
    startDate.getUTCFullYear(),
    String(startDate.getUTCMonth() + 1).padStart(2, '0'),
    String(startDate.getUTCDate()).padStart(2, '0'),
  ].join('-');

  return {
    start,
    end: from,
  };
};