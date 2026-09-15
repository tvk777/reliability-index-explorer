export type MerchantCategoryGroup =
  | 'essential'
  | 'discretionary'
  | 'high_risk'
  | 'savings'
  | 'cash'
  | 'income'
  | 'fees';

export type MerchantCategory = {
  code: string;
  name: string;
  group: MerchantCategoryGroup;
};

export type MerchantCategoriesResponse = {
  categories: MerchantCategory[];
}
