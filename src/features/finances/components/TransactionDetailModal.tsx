import { Modal } from '../../../shared/ui/Modal';
import { Button } from '../../../shared/ui/Button';
import { Transaction } from '../../../shared/types';
import { useAppStore } from '../../../stores/useAppStore';
import { formatCurrency } from '../../../shared/lib/helpers';
import { useI18n } from '../../../shared/i18n/useI18n';
import { format } from 'date-fns';
import { Trash2, Calendar, Landmark, Tag, Edit3 } from 'lucide-react';

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TransactionDetailModal({ transaction, isOpen, onClose }: TransactionDetailModalProps) {
  const { t } = useI18n();
  const { deleteTransaction, accounts } = useAppStore();

  if (!transaction) return null;

  const account = accounts.find(a => a.id === transaction.accountId);

  const handleDelete = () => {
    deleteTransaction(transaction.id);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('finances.transactionDetails')} size="sm">
      <div className="space-y-6">
        <div className="text-center py-6">
          <div className={`text-3xl font-bold font-mono ${transaction.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
          </div>
          <p className="text-text-secondary text-sm mt-1">{transaction.description}</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-border">
            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-violet-400" />
              <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Date</span>
            </div>
            <span className="text-sm font-semibold text-text-primary">{format(new Date(transaction.date), 'MMMM d, yyyy')}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-border">
            <div className="flex items-center gap-3">
              <Landmark size={16} className="text-violet-400" />
              <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Account</span>
            </div>
            <span className="text-sm font-semibold text-text-primary">{account?.name || 'Unknown Account'}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-border">
            <div className="flex items-center gap-3">
              <Tag size={16} className="text-violet-400" />
              <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Category</span>
            </div>
            <span className="text-xs bg-bg-tertiary px-2 py-1 rounded-lg border border-border/50 text-text-secondary">{transaction.category}</span>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-border">
          <Button 
            variant="ghost" 
            className="flex-1 text-rose-400 hover:bg-rose-500/10" 
            leftIcon={<Trash2 size={16} />}
            onClick={handleDelete}
          >
            Delete
          </Button>
          <Button 
            variant="primary" 
            className="flex-1" 
            leftIcon={<Edit3 size={16} />}
            onClick={() => { /* Edit logic would go here if we had an edit form */ }}
          >
            Edit
          </Button>
        </div>
      </div>
    </Modal>
  );
}
