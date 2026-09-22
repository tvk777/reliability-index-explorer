import type { Transaction } from '../types/transaction';

export const isTransactionInRange = (transaction: Transaction, startDate: string, endDate: string) => {
  return transaction.date >= startDate && transaction.date <= endDate;
};
