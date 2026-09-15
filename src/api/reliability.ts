import type { ReliabilityResponse } from '../types/reliability';
import { API_BASE_URL } from './constants';


export const fetchReliability = async (userId: string, from: string):Promise<ReliabilityResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}/reliability?from=${from}`);

  if(!response.ok){
    throw new Error('Failed to fetch reliability data');
  }

  return response.json();
}