import { useState, useEffect } from 'react';
import { SlideOver } from '../../../shared/ui/Modal';
import { Button } from '../../../shared/ui/Button';
import { useAppStore } from '../../../stores/useAppStore';
import { useI18n } from '../../../shared/i18n/useI18n';

interface BudgetManagerSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BudgetManagerSlideOver({ isOpen, onClose }: BudgetManagerSlideOverProps) {
  const { t } = useI18n();
  const budgets = useAppStore((state) => state.budgets);
  const updateBudget = useAppStore((state) => state.updateBudget);
  const [localBudgets, setLocalBudgets] = useState(budgets);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalBudgets(budgets);
    }
  }, [isOpen, budgets]);

  const handleSave = () => {
    localBudgets.forEach(lb => {
      updateBudget(lb.id, { amount: lb.amount });
    });
    onClose();
  };

  const updateLocalAmount = (id: string, amount: number) => {
    setLocalBudgets(prev => prev.map(b => b.id === id ? { ...b, amount } : b));
  };

  return (
    <SlideOver isOpen={isOpen} onClose={onClose} title={t('finances.manageBudgets')} width="w-full sm:w-96">
      <div className="space-y-6">
        <p className="text-sm text-text-secondary leading-relaxed">
          {t('finances.budgetManagerDescription')}
        </p>
        <div className="space-y-4">
          {localBudgets.map(budget => (
            <div key={budget.id} className="space-y-3">
              <div className="flex justify-between px-1">
                <span className="text-sm font-bold text-text-primary">{budget.category}</span>
                <span className="text-sm font-bold text-violet-400 font-mono">${budget.amount}</span>
              </div>
              <input 
                type="range" 
                min="0"
                max="5000"
                step="50"
                value={budget.amount}
                onChange={(e) => updateLocalAmount(budget.id, parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-full appearance-none accent-violet-500 cursor-pointer hover:accent-violet-400 transition-all" 
              />
            </div>
          ))}
        </div>
        <Button 
          variant="primary" 
          className="w-full mt-6 h-12 shadow-lg shadow-violet-500/20 font-bold" 
          onClick={handleSave}
        >
          {t('finances.saveAllChanges')}
        </Button>
      </div>
    </SlideOver>
  );
}
