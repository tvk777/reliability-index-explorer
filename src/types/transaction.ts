export type Transaction = {
  id: string;
  account_id: string;
  amount: number;
  currency: string;
  date: string;
  description: string;
  merchant_category_code: string;
  merchant_name: string;
  type: 'debit' | 'credit';
  user_id: string;
  synced_at: string;
};

export type TransactionsResponse = {
  transactions: Transaction[];
  total: number;
  has_more: boolean;
};