import type { Transaction } from '../types/transaction';

export type MonthlyCashflow = {
  month: string;
  income: number;
  outflow: number;
  net: number;
};

export const getMonthlyCashflow = (
  transactions: Transaction[],
  startDate: string,
  endDate: string,
): MonthlyCashflow[] => {
  const monthlyCashflow = new Map<string, MonthlyCashflow>();

  const [startYear, startMonth] = startDate.split('-').map(Number);

  const [endYear, endMonth] = endDate.split('-').map(Number);

  const currentDate = new Date(Date.UTC(startYear, startMonth - 1, 1));

  const lastDate = new Date(Date.UTC(endYear, endMonth - 1, 1));

  while (currentDate <= lastDate) {
    const year = currentDate.getUTCFullYear();
    const month = String(currentDate.getUTCMonth() + 1).padStart(2, '0');

    const monthKey = `${year}-${month}`;

    monthlyCashflow.set(monthKey, {
      month: monthKey,
      income: 0,
      outflow: 0,
      net: 0,
    });

    currentDate.setUTCMonth(currentDate.getUTCMonth() + 1);
  }

  transactions.forEach((transaction) => {
    const monthKey = transaction.date.slice(0, 7);

    const month = monthlyCashflow.get(monthKey);

    if (!month) {
      return;
    }

    if (transaction.type === 'credit') {
      month.income += transaction.amount;
    } else {
      month.outflow += Math.abs(transaction.amount);
    }

    month.net = month.income - month.outflow;
  });

  return Array.from(monthlyCashflow.values());
};