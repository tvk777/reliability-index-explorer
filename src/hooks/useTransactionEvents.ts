import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { createTransactionEventSource } from '../api/transaction-events';
import type { TransactionEvent } from '../types/transactionEvent';
import type { TransactionsResponse } from '../types/transaction';
import type { ScoringWindow } from '../utils/scoringWindow';
import { isTransactionInRange } from '../utils/isTransactionInRange';

type UseTransactionEventsProps = {
  userId: string;
  scoringWindow: ScoringWindow;
};

export const useTransactionEvents = ({ userId, scoringWindow }: UseTransactionEventsProps) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const eventSource = createTransactionEventSource(userId);

    const transactionsQueryKey = ['transactions', userId, scoringWindow.start, scoringWindow.end];

    const handleTransactionEvent = (event: MessageEvent) => {
      const data: TransactionEvent = JSON.parse(event.data);

      let transactionsChanged = false;

      switch (data.type) {
        case 'TRANSACTION_ADDED':
          if (!isTransactionInRange(data.transaction, scoringWindow.start, scoringWindow.end)) {
            break;
          }

          queryClient.setQueryData<TransactionsResponse>(transactionsQueryKey, (currentData) => {
            if (!currentData) {
              return currentData;
            }

            const alreadyExists = currentData.transactions.some(
              (transaction) => transaction.id === data.transaction.id,
            );

            if (alreadyExists) {
              return currentData;
            }

            transactionsChanged = true;

            return {
              ...currentData,
              transactions: [...currentData.transactions, data.transaction],
            };
          });

          break;

        case 'TRANSACTION_UPDATED':
          queryClient.setQueryData<TransactionsResponse>(transactionsQueryKey, (currentData) => {
            if (!currentData) {
              return currentData;
            }

            const exists = currentData.transactions.some((transaction) => transaction.id === data.transaction.id);

            if (!exists) {
              return currentData;
            }

            transactionsChanged = true;

            return {
              ...currentData,
              transactions: currentData.transactions.map((transaction) =>
                transaction.id === data.transaction.id ? data.transaction : transaction,
              ),
            };
          });

          break;

        case 'TRANSACTION_DELETED':
          queryClient.setQueryData<TransactionsResponse>(transactionsQueryKey, (currentData) => {
            if (!currentData) {
              return currentData;
            }

            const exists = currentData.transactions.some((transaction) => transaction.id === data.transaction_id);

            if (!exists) {
              return currentData;
            }

            transactionsChanged = true;

            return {
              ...currentData,
              transactions: currentData.transactions.filter((transaction) => transaction.id !== data.transaction_id),
            };
          });

          break;
      }

      if (transactionsChanged) {
        queryClient.invalidateQueries({
          queryKey: ['reliability', userId, scoringWindow.end],
        });
      }
    };

    eventSource.addEventListener('TRANSACTION_ADDED', handleTransactionEvent);

    eventSource.addEventListener('TRANSACTION_UPDATED', handleTransactionEvent);

    eventSource.addEventListener('TRANSACTION_DELETED', handleTransactionEvent);

    eventSource.onerror = (error) => {
      console.error('SSE error', error);
    };

    return () => {
      eventSource.close();
    };
  }, [userId, scoringWindow.start, scoringWindow.end, queryClient]);
};
