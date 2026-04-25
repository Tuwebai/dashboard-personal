import { useMemo, useState } from 'react';
import { Modal } from '../../../shared/ui/Modal';
import { Button } from '../../../shared/ui/Button';
import { Input, Select } from '../../../shared/ui/Input';
import { cn } from '../../../shared/lib/cn';
import { useAppStore } from '../../../stores/useAppStore';
import { useI18n } from '../../../shared/i18n/useI18n';
import { Transaction } from '../../../shared/types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
}

const buildInitialTransactionState = (accountId = '') => ({
  description: '',
  amount: '',
  type: 'expense' as 'income' | 'expense',
  category: 'Other',
  accountId,
});

const normalizeTransactionType = (type: Transaction['type']): 'income' | 'expense' =>
  type === 'income' ? 'income' : 'expense';

const buildTransactionState = (transaction: Transaction | null | undefined, accountId = '') =>
  transaction
    ? {
        description: transaction.description,
        amount: transaction.amount.toString(),
        type: normalizeTransactionType(transaction.type),
        category: transaction.category,
        accountId: transaction.accountId,
      }
    : buildInitialTransactionState(accountId);

const parseTransactionAmount = (value: string): number => {
  const normalized = value.replace(/\s/g, '');

  if (!normalized) {
    return Number.NaN;
  }

  const separators = [...normalized.matchAll(/[.,]/g)];

  if (separators.length === 0) {
    return Number(normalized);
  }

  const lastSeparator = separators[separators.length - 1];
  const separatorIndex = lastSeparator.index ?? -1;
  const decimalDigits = normalized.length - separatorIndex - 1;
  const treatAsDecimal = decimalDigits > 0 && decimalDigits <= 2;

  if (!treatAsDecimal) {
    return Number(normalized.replace(/[.,]/g, ''));
  }

  const integerPart = normalized.slice(0, separatorIndex).replace(/[.,]/g, '');
  const decimalPart = normalized.slice(separatorIndex + 1).replace(/[.,]/g, '');

  return Number(`${integerPart}.${decimalPart}`);
};

export function AddTransactionModal({ isOpen, onClose, transaction }: AddTransactionModalProps) {
  const { t } = useI18n();
  const { accounts, addTransaction, updateTransaction } = useAppStore();
  const defaultAccountId = accounts[0]?.id || '';
  const [newTx, setNewTx] = useState(() => buildTransactionState(transaction, defaultAccountId));

  const categoryOptions = useMemo(
    () => [
      { value: 'Food', label: t('finances.categoryFood') },
      { value: 'Shopping', label: t('finances.categoryShopping') },
      { value: 'Entertainment', label: t('finances.categoryEntertainment') },
      { value: 'Transport', label: t('finances.categoryTransport') },
      { value: 'Income', label: t('finances.income') },
      { value: 'Other', label: t('finances.categoryOther') },
    ],
    [t],
  );

  const handleAdd = () => {
    if (!newTx.description || !newTx.amount) return;
    const amount = parseTransactionAmount(newTx.amount);
    if (Number.isNaN(amount)) return;

    const payload = {
      description: newTx.description,
      amount,
      type: newTx.type,
      category: newTx.category,
      accountId: newTx.accountId,
    };

    if (transaction) {
      updateTransaction(transaction.id, payload);
    } else {
      addTransaction({
        ...payload,
        date: new Date().toISOString().split('T')[0],
        tags: [],
        isRecurring: false,
      });
    }

    onClose();
    setNewTx(buildInitialTransactionState(defaultAccountId));
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={transaction ? t('finances.editTransaction') : t('finances.newTransaction')}
      size="md"
    >
      <div className="space-y-6">
        <div className="flex p-1 bg-white/5 rounded-xl border border-white/5">
          <button onClick={() => setNewTx({...newTx, type: 'expense'})} className={cn("flex-1 py-1.5 text-xs font-bold rounded-lg transition-all", newTx.type === 'expense' ? "bg-rose-500 text-white shadow-md" : "text-white/40 hover:text-white/80")}>{t('finances.expense')}</button>
          <button onClick={() => setNewTx({...newTx, type: 'income'})} className={cn("flex-1 py-1.5 text-xs font-bold rounded-lg transition-all", newTx.type === 'income' ? "bg-emerald-500 text-white shadow-md" : "text-white/40 hover:text-white/80")}>{t('finances.income')}</button>
        </div>
        
        <Input 
          label={t('finances.descriptionLabel')}
          placeholder={t('finances.descriptionPlaceholder')}
          value={newTx.description}
          onChange={e => setNewTx({...newTx, description: e.target.value})}
        />

        <Input 
          label={t('finances.amountLabel')}
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          value={newTx.amount}
          onChange={e => setNewTx({...newTx, amount: e.target.value})}
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-1">{t('finances.categoryLabel')}</label>
            <Select
              value={newTx.category}
              onChange={e => setNewTx({...newTx, category: e.target.value})}
              options={categoryOptions}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-1">{t('finances.accountLabel')}</label>
            <Select
              value={newTx.accountId}
              onChange={e => setNewTx({...newTx, accountId: e.target.value})}
              options={accounts.map(acc => ({ value: acc.id, label: acc.name }))}
            />
          </div>
        </div>

        <div className="pt-4">
            <Button variant="primary" className="w-full h-11" onClick={handleAdd}>
              {transaction ? t('finances.saveTransactionChanges') : t('finances.confirmTransaction')}
            </Button>
        </div>
      </div>
    </Modal>
  );
}
