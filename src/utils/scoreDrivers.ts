export type ParsedScoreDriver = {
  text: string;
  points: number;
};

const POINTS_PATTERN = /([+-]\d+)\s*pts?/i;

export const parseScoreDrivers = (drivers: string[]): ParsedScoreDriver[] => {
  return drivers
    .filter((driver) => POINTS_PATTERN.test(driver))
    .map((driver) => {
      const match = driver.match(POINTS_PATTERN);

      return {
        text: driver,
        points: match ? Number(match[1]) : 0,
      };
    });
};
