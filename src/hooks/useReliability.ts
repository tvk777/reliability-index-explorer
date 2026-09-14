import { useQuery } from '@tanstack/react-query';
import { fetchReliability } from '../api/reliability';

export const useReliability = (userId: string, from: string) =>
  useQuery({
    queryKey: ['reliability', userId, from],
    queryFn: () => fetchReliability(userId, from),
    staleTime: 5 * 60 * 1000,
  });
