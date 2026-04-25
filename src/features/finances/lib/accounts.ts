import type { FinancialAccount, Transaction } from '../../../shared/types';

export type DerivedFinancialAccount = FinancialAccount & {
  derivedBalance: number;
};

export const getDerivedAccountBalance = (
  accountId: string,
  transactions: Transaction[],
): number =>
  transactions.reduce((total, transaction) => {
    if (transaction.accountId !== accountId) {
      return total;
    }

    if (transaction.type === 'income') {
      return total + transaction.amount;
    }

    if (transaction.type === 'expense') {
      return total - transaction.amount;
    }

    return total;
  }, 0);

export const getDerivedAccounts = (
  accounts: FinancialAccount[],
  transactions: Transaction[],
): DerivedFinancialAccount[] =>
  accounts.map((account) => ({
    ...account,
    derivedBalance: getDerivedAccountBalance(account.id, transactions),
  }));
