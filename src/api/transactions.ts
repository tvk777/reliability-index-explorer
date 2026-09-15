import type { TransactionsResponse } from '../types/transaction';
import { API_BASE_URL } from './constants';

export const fetchTransactions = async (userId: string, from: string, to: string): Promise<TransactionsResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}/transactions?from=${from}&to=${to}`);

  if (!response.ok) {
    throw new Error('Failed to fetch transactions');
  }

  return response.json();
}; 