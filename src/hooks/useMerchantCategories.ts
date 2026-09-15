import { useQuery } from '@tanstack/react-query';
import { fetchMerchantCategories } from '../api/merchant-categories';

export const useMerchantCategories = () => {
  return useQuery({
    queryKey: ['merchant-categories'],
    queryFn: fetchMerchantCategories,
    staleTime: 60 * 60 * 1000,
  });
};
