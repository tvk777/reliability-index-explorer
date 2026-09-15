import { useQuery } from '@tanstack/react-query';
import { fetchTransactions } from '../api/transactions';

export const useTransactions = (userId: string, from: string, to:string) =>
  useQuery({
    queryKey: ['transactions', userId, from, to],
    queryFn: () => fetchTransactions(userId, from, to),
    staleTime: 5 * 60 * 1000,
  });
