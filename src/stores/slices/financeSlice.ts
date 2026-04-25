import { StateCreator } from 'zustand';
import { FinanceSlice, AppStore } from '../types';
import { genId } from '../../shared/lib/id';
import { format } from 'date-fns';
import type { FinancialAccount } from '../../shared/types';

const ensureSingleDefaultAccount = (accounts: FinancialAccount[]) => {
  if (accounts.length === 0) {
    return;
  }

  const defaultAccounts = accounts.filter((account) => account.isDefault);

  if (defaultAccounts.length === 0) {
    accounts[0].isDefault = true;
    return;
  }

  const [firstDefault, ...restDefaults] = defaultAccounts;

  restDefaults.forEach((account) => {
    const target = accounts.find(({ id }) => id === account.id);
    if (target) {
      target.isDefault = false;
    }
  });

  const selected = accounts.find(({ id }) => id === firstDefault.id);
  if (selected) {
    selected.isDefault = true;
  }
};

export const createFinanceSlice: StateCreator<
  AppStore,
  [["zustand/immer", never], ["zustand/persist", unknown]],
  [],
  FinanceSlice
> = (set) => ({
  accounts: [],
  transactions: [],
  budgets: [],
  goals: [],

  addTransaction: (txData) => set(state => {
    state.transactions.unshift({
      ...txData,
      id: genId(),
      createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
    });
  }),

  updateTransaction: (id, updates) => set(state => {
    const idx = state.transactions.findIndex(t => t.id === id);
    if (idx !== -1) Object.assign(state.transactions[idx], updates);
  }),

  deleteTransaction: (id) => set(state => {
    state.transactions = state.transactions.filter(t => t.id !== id);
  }),

  addAccount: (accountData) => set(state => {
    const nextAccount = {
      ...accountData,
      id: genId(),
      balance: 0,
      isDefault: state.accounts.length === 0 ? true : accountData.isDefault,
      createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
    };

    if (nextAccount.isDefault) {
      state.accounts.forEach((account) => {
        account.isDefault = false;
      });
    }

    state.accounts.push({
      ...nextAccount,
    });

    ensureSingleDefaultAccount(state.accounts);
  }),

  updateAccount: (id, updates) => set(state => {
    const idx = state.accounts.findIndex(a => a.id === id);
    if (idx === -1) return;

    if (updates.isDefault) {
      state.accounts.forEach((account) => {
        account.isDefault = account.id === id;
      });
    } else if (updates.isDefault === false) {
      const current = state.accounts[idx];
      const otherDefaultExists = state.accounts.some((account) => account.id !== id && account.isDefault);

      if (!current.isDefault || otherDefaultExists) {
        current.isDefault = false;
      }
    }

    Object.assign(state.accounts[idx], {
      ...updates,
      balance: 0,
    });

    ensureSingleDefaultAccount(state.accounts);
  }),

  deleteAccount: (id) => set(state => {
    const account = state.accounts.find(({ id: accountId }) => accountId === id);
    if (!account) return;

    const hasTransactions = state.transactions.some((transaction) => transaction.accountId === id);
    if (hasTransactions) return;

    if (state.accounts.length === 1) return;

    state.accounts = state.accounts.filter((item) => item.id !== id);

    if (account.isDefault) {
      const nextDefault = state.accounts[0];
      if (nextDefault) {
        nextDefault.isDefault = true;
      }
    }

    ensureSingleDefaultAccount(state.accounts);
  }),

  updateBudget: (id, updates) => set(state => {
    const idx = state.budgets.findIndex(b => b.id === id);
    if (idx !== -1) Object.assign(state.budgets[idx], updates);
  }),

  addGoal: (goalData) => set(state => {
    state.goals.push({
      ...goalData,
      id: genId(),
      createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
    });
  }),

  updateGoal: (id, updates) => set(state => {
    const idx = state.goals.findIndex(g => g.id === id);
    if (idx !== -1) Object.assign(state.goals[idx], updates);
  }),
});
