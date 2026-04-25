import type { ID, ISODateString } from './common';
import type { RecurrenceType } from './tasks';

export type TransactionType = 'income' | 'expense' | 'transfer';
export type AccountType = 'checking' | 'savings' | 'credit' | 'cash' | 'investment';

export interface FinancialAccount {
  id: ID;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  color: string;
  icon: string;
  isDefault: boolean;
  createdAt: ISODateString;
}

export interface Transaction {
  id: ID;
  type: TransactionType;
  amount: number;
  category: string;
  subcategory?: string;
  description: string;
  date: ISODateString;
  accountId: ID;
  toAccountId?: ID;
  tags: string[];
  isRecurring: boolean;
  recurrenceType?: RecurrenceType;
  receiptUrl?: string;
  createdAt: ISODateString;
}

export interface Budget {
  id: ID;
  category: string;
  amount: number;
  spent: number;
  period: 'monthly' | 'weekly' | 'yearly';
  color: string;
  rollover: boolean;
  alertThreshold: number;
  createdAt: ISODateString;
}

export interface FinancialGoal {
  id: ID;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: ISODateString;
  color: string;
  icon: string;
  createdAt: ISODateString;
}

export interface FinancialSummary {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  cashFlow: CashFlowEntry[];
}

export interface CashFlowEntry {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}
