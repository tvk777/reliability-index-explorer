import type { Transaction } from './transaction';

export type TransactionEvent =
  | {
      type: 'TRANSACTION_ADDED';
      transaction: Transaction;
    }
  | {
      type: 'TRANSACTION_UPDATED';
      transaction: Transaction;
    }
  | {
      type: 'TRANSACTION_DELETED';
      transaction_id: string;
    };
