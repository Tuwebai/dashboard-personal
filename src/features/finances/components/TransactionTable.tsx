import { useAppStore } from '../../../stores/useAppStore';
import { ShoppingCart, Coffee, CreditCard, ArrowUpRight, Landmark, Zap, Car, Trash2, LucideIcon } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../../../shared/lib/cn';
import { format } from 'date-fns';
import type { Transaction } from '../../../shared/types';
import { useI18n } from '../../../shared/i18n/useI18n';

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
  const { transactions, deleteTransaction } = useAppStore();
  
  const filteredTransactions = accountId 
    ? transactions.filter((tx: Transaction) => tx.accountId === accountId)
    : transactions;

  const displayTransactions = limit ? filteredTransactions.slice(0, limit) : filteredTransactions;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
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
              
              return (
                <tr 
                  key={tx.id} 
                  onClick={() => onRowClick?.(tx)}
                  className="hover:bg-white/3 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center transition-all",
                        isIncome ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-text-muted group-hover:text-text-primary"
                      )}>
                        <Icon size={18} />
                      </div>
                      <span className="text-sm font-semibold text-text-primary truncate max-w-[200px]">{tx.description}</span>
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
                      onClick={(e) => { e.stopPropagation(); deleteTransaction(tx.id); toast.success(t('finances.transactionDeleted')); }}
                      className="p-2 text-text-muted hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
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
    </div>
  );
}
