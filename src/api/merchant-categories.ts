import { API_BASE_URL } from './constants';
import type { MerchantCategoriesResponse } from '../types/merchantCategory';

export const fetchMerchantCategories = async (): Promise<MerchantCategoriesResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/dictionaries/merchant-categories`);

  if (!response.ok) {
    throw new Error('Failed to fetch merchant categories');
  }

  return response.json();
};
