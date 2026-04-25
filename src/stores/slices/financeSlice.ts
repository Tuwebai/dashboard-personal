import { StateCreator } from 'zustand';
import { FinanceSlice, AppStore } from '../types';
import { genId } from '../../shared/lib/id';

import { format } from 'date-fns';

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
    state.accounts.push({
      ...accountData,
      id: genId(),
      createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
    });
  }),

  updateAccount: (id, updates) => set(state => {
    const idx = state.accounts.findIndex(a => a.id === id);
    if (idx !== -1) Object.assign(state.accounts[idx], updates);
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
