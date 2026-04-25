import { useAppStore } from '../../../stores/useAppStore';
import { ShoppingCart, Coffee, CreditCard, ArrowUpRight, Landmark, Zap, Car, Trash2, LucideIcon } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../../../shared/lib/cn';
import { format } from 'date-fns';
import type { Transaction } from '../../../shared/types';
import { useI18n } from '../../../shared/i18n/useI18n';
import { Fragment, useState } from 'react';
import { ConfirmDialog } from '../../../shared/ui/ConfirmDialog';
import { useShallow } from 'zustand/react/shallow';

interface TransactionTableProps {
  limit?: number;
  accountId?: string;
  onRowClick?: (tx: Transaction) => void;
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'Shopping': ShoppingCart,
  'Food': Coffee,
  'Entertainment': Zap,
  'Transport': Car,
  'Investment': Landmark,
  'Income': ArrowUpRight,
};

export function TransactionTable({ limit, accountId, onRowClick }: TransactionTableProps) {
  const { t } = useI18n();
  const { transactions, accounts, deleteTransaction } = useAppStore(
    useShallow((state) => ({
      transactions: state.transactions,
      accounts: state.accounts,
      deleteTransaction: state.deleteTransaction,
    })),
  );
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  
  const filteredTransactions = accountId 
    ? transactions.filter((tx: Transaction) => tx.accountId === accountId)
    : transactions;

  const displayTransactions = limit ? filteredTransactions.slice(0, limit) : filteredTransactions;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  const confirmDelete = () => {
    if (!pendingDeleteId) return;
    deleteTransaction(pendingDeleteId);
    setPendingDeleteId(null);
    toast.success(t('finances.transactionDeleted'));
  };

  return (
    <div className="bg-bg-secondary border border-border rounded-2xl overflow-hidden glass">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white/5 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">{t('finances.tableTransaction')}</th>
              <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">{t('finances.tableCategory')}</th>
              <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">{t('finances.tableDate')}</th>
              <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest text-right">{t('finances.tableAmount')}</th>
              <th className="px-6 py-4 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {displayTransactions.map((tx: Transaction) => {
              const Icon = CATEGORY_ICONS[tx.category] || CreditCard;
              const isIncome = tx.type === 'income';
              const account = accounts.find((item) => item.id === tx.accountId);
               
              return (
                <Fragment key={tx.id}>
                  <tr 
                    key={tx.id} 
                    onClick={() => onRowClick?.(tx)}
                    className="hidden cursor-pointer transition-colors group hover:bg-white/3 md:table-row"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-9 h-9 rounded-xl flex items-center justify-center transition-all",
                          isIncome ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-text-muted group-hover:text-text-primary"
                        )}>
                          <Icon size={18} />
                        </div>
                        <span className="max-w-[200px] truncate text-sm font-semibold text-text-primary">{tx.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-bg-tertiary px-2 py-1 rounded-lg border border-border/50 text-text-secondary">{tx.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-text-muted">{format(new Date(tx.date), 'MMM d, yyyy')}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={cn(
                        "text-sm font-bold font-mono",
                        isIncome ? "text-emerald-400" : "text-rose-400"
                      )}>
                        {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setPendingDeleteId(tx.id); }}
                        className="p-2 text-text-muted hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                  <tr key={`${tx.id}-mobile`} className="md:hidden">
                    <td colSpan={5} className="p-3">
                      <button
                        onClick={() => onRowClick?.(tx)}
                        className="w-full rounded-2xl border border-border/70 bg-white/3 p-4 text-left transition-all hover:bg-white/5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-start gap-3">
                            <div className={cn(
                              "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                              isIncome ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-text-muted"
                            )}>
                              <Icon size={18} />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-text-primary">{tx.description}</p>
                              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-text-muted">
                                <span>{format(new Date(tx.date), 'MMM d, yyyy')}</span>
                                <span className="rounded-lg border border-border/50 bg-bg-tertiary px-2 py-1 text-[11px] text-text-secondary">
                                  {tx.category}
                                </span>
                              </div>
                              <div className="mt-2 flex items-center gap-2 text-[11px] text-text-muted">
                                <Landmark size={12} />
                                <span className="truncate">{account?.name ?? t('finances.unknownAccount')}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex shrink-0 flex-col items-end gap-3">
                            <span className={cn(
                              "text-sm font-bold font-mono",
                              isIncome ? "text-emerald-400" : "text-rose-400"
                            )}>
                              {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                            </span>
                            <button
                              onClick={(e) => { e.stopPropagation(); setPendingDeleteId(tx.id); }}
                              className="rounded-lg p-2 text-text-muted transition-all hover:bg-rose-500/10 hover:text-rose-400"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </button>
                    </td>
                  </tr>
                </Fragment>
              );
            })}
            {displayTransactions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-xs text-text-muted italic">
                  {t('finances.noTransactionsForSelection')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ConfirmDialog
        isOpen={pendingDeleteId !== null}
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={confirmDelete}
        title={t('finances.deleteTransactionTitle')}
        message={t('finances.deleteTransactionMessage')}
        confirmLabel={t('finances.deleteTransaction')}
      />
    </div>
  );
}
