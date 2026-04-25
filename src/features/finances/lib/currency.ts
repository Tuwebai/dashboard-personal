import type { FinancialAccount, Transaction, UserSettings } from '../../../shared/types';

function getFinanceLocale(language: UserSettings['language']) {
  return language === 'es' ? 'es-AR' : 'en-US';
}

export function getPrimaryFinanceCurrency(accounts: FinancialAccount[]) {
  return accounts.find((account) => account.isDefault)?.currency ?? accounts[0]?.currency ?? 'USD';
}

export function getTransactionCurrency(
  transaction: Pick<Transaction, 'accountId'>,
  accounts: FinancialAccount[],
  fallbackCurrency: string,
) {
  return accounts.find((account) => account.id === transaction.accountId)?.currency ?? fallbackCurrency;
}

export function formatFinanceCurrency(
  amount: number,
  currency: string,
  language: UserSettings['language'],
  options?: Intl.NumberFormatOptions,
) {
  return new Intl.NumberFormat(getFinanceLocale(language), {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(amount);
}
