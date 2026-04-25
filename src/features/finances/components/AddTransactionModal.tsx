import { useState } from 'react';
import { Modal } from '../../../shared/ui/Modal';
import { Button } from '../../../shared/ui/Button';
import { Input, Select } from '../../../shared/ui/Input';
import { cn } from '../../../shared/lib/cn';
import { useAppStore } from '../../../stores/useAppStore';
import { useI18n } from '../../../shared/i18n/useI18n';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddTransactionModal({ isOpen, onClose }: AddTransactionModalProps) {
  const { t } = useI18n();
  const { accounts, addTransaction } = useAppStore();
  const [newTx, setNewTx] = useState({
    description: '',
    amount: '',
    type: 'expense' as 'income' | 'expense',
    category: 'Other',
    accountId: accounts[0]?.id || ''
  });

  const handleAdd = () => {
    if (!newTx.description || !newTx.amount) return;
    addTransaction({
      description: newTx.description,
      amount: parseFloat(newTx.amount),
      type: newTx.type,
      category: newTx.category,
      accountId: newTx.accountId,
      date: new Date().toISOString().split('T')[0],
      tags: [],
      isRecurring: false
    });
    onClose();
    setNewTx({ description: '', amount: '', type: 'expense', category: 'Other', accountId: accounts[0]?.id || '' });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={t('finances.newTransaction')}
      size="md"
    >
      <div className="space-y-6">
        <div className="flex p-1 bg-white/5 rounded-xl border border-white/5">
          <button onClick={() => setNewTx({...newTx, type: 'expense'})} className={cn("flex-1 py-1.5 text-xs font-bold rounded-lg transition-all", newTx.type === 'expense' ? "bg-rose-500 text-white shadow-md" : "text-white/40 hover:text-white/80")}>Expense</button>
          <button onClick={() => setNewTx({...newTx, type: 'income'})} className={cn("flex-1 py-1.5 text-xs font-bold rounded-lg transition-all", newTx.type === 'income' ? "bg-emerald-500 text-white shadow-md" : "text-white/40 hover:text-white/80")}>Income</button>
        </div>
        
        <Input 
          label={t('finances.descriptionLabel')}
          placeholder={t('finances.descriptionPlaceholder')}
          value={newTx.description}
          onChange={e => setNewTx({...newTx, description: e.target.value})}
        />

        <Input 
          label={t('finances.amountLabel')}
          type="number"
          placeholder="0.00"
          value={newTx.amount}
          onChange={e => setNewTx({...newTx, amount: e.target.value})}
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-1">Category</label>
            <Select
              value={newTx.category}
              onChange={e => setNewTx({...newTx, category: e.target.value})}
              options={[
                { value: 'Food', label: 'Food' },
                { value: 'Shopping', label: 'Shopping' },
                { value: 'Entertainment', label: 'Entertainment' },
                { value: 'Transport', label: 'Transport' },
                { value: 'Income', label: 'Income' },
                { value: 'Other', label: 'Other' },
              ]}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-1">Account</label>
            <Select
              value={newTx.accountId}
              onChange={e => setNewTx({...newTx, accountId: e.target.value})}
              options={accounts.map(acc => ({ value: acc.id, label: acc.name }))}
            />
          </div>
        </div>

        <div className="pt-4">
            <Button variant="primary" className="w-full h-11" onClick={handleAdd}>Confirm Transaction</Button>
        </div>
      </div>
    </Modal>
  );
}
