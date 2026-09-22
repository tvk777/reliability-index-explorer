import type { Transaction } from '../types/transaction';

export const generateTestTransactions = (transactions: Transaction[], count: number): Transaction[] => {
  if (transactions.length === 0 || count <= 0) {
    return [];
  }

  return Array.from({ length: count }, (_, index) => {
    const sourceTransaction = transactions[index % transactions.length];

    return {
      ...sourceTransaction,
      id: `${sourceTransaction.id}-test-${index}`,
    };
  });
};
