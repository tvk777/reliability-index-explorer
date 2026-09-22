import { SSE_BASE_URL } from './constants';

export const createTransactionEventSource = (userId: string) => {
  const url = `${SSE_BASE_URL}/api/users/${userId}/transaction-events`;

  return new EventSource(url);
};
