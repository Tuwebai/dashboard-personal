import { Modal } from '../../../shared/ui/Modal';
import { Button } from '../../../shared/ui/Button';
import { Transaction } from '../../../shared/types';
import { useAppStore } from '../../../stores/useAppStore';
import { formatCurrency } from '../../../shared/lib/helpers';
import { useI18n } from '../../../shared/i18n/useI18n';
import { format } from 'date-fns';
import { Trash2, Calendar, Landmark, Tag, Edit3 } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { ConfirmDialog } from '../../../shared/ui/ConfirmDialog';

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (transaction: Transaction) => void;
}

const getCategoryLabel = (category: string, t: (key: string) => string) => {
  switch (category) {
    case 'Food':
      return t('finances.categoryFood');
    case 'Shopping':
      return t('finances.categoryShopping');
    case 'Entertainment':
      return t('finances.categoryEntertainment');
    case 'Transport':
      return t('finances.categoryTransport');
    case 'Income':
      return t('finances.income');
    case 'Other':
      return t('finances.categoryOther');
    default:
      return category;
  }
};

export function TransactionDetailModal({ transaction, isOpen, onClose, onEdit }: TransactionDetailModalProps) {
  const { t } = useI18n();
  const { deleteTransaction, accounts } = useAppStore();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  if (!transaction) return null;

  const account = accounts.find(a => a.id === transaction.accountId);

  const handleDelete = () => {
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!transaction) return;
    deleteTransaction(transaction.id);
    setIsDeleteOpen(false);
    toast.success(t('finances.transactionDeleted'));
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
              <span className="text-xs font-bold text-text-muted uppercase tracking-widest">{t('finances.dateLabel')}</span>
            </div>
            <span className="text-sm font-semibold text-text-primary">{format(new Date(transaction.date), 'MMMM d, yyyy')}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-border">
            <div className="flex items-center gap-3">
              <Landmark size={16} className="text-violet-400" />
              <span className="text-xs font-bold text-text-muted uppercase tracking-widest">{t('finances.accountLabel')}</span>
            </div>
            <span className="text-sm font-semibold text-text-primary">{account?.name || t('finances.unknownAccount')}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-border">
            <div className="flex items-center gap-3">
              <Tag size={16} className="text-violet-400" />
              <span className="text-xs font-bold text-text-muted uppercase tracking-widest">{t('finances.categoryLabel')}</span>
            </div>
            <span className="text-xs bg-bg-tertiary px-2 py-1 rounded-lg border border-border/50 text-text-secondary">
              {getCategoryLabel(transaction.category, t)}
            </span>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-border">
          <Button 
            variant="ghost" 
            className="flex-1 text-rose-400 hover:bg-rose-500/10" 
            leftIcon={<Trash2 size={16} />}
            onClick={handleDelete}
          >
            {t('finances.deleteTransaction')}
          </Button>
          <Button 
            variant="primary" 
            className="flex-1" 
            leftIcon={<Edit3 size={16} />}
            onClick={() => onEdit(transaction)}
          >
            {t('common.edit')}
          </Button>
        </div>
        <ConfirmDialog
          isOpen={isDeleteOpen}
          onCancel={() => setIsDeleteOpen(false)}
          onConfirm={confirmDelete}
          title={t('finances.deleteTransactionTitle')}
          message={t('finances.deleteTransactionMessage')}
          confirmLabel={t('finances.deleteTransaction')}
        />
      </div>
    </Modal>
  );
}
