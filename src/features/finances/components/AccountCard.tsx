import { motion } from 'framer-motion';
import { Landmark, CreditCard, Coins, PiggyBank, Pencil, Star, Trash2, type LucideIcon } from 'lucide-react';
import { Button } from '../../../shared/ui/Button';
import { formatCurrency } from '../../../shared/lib/helpers';
import { useI18n } from '../../../shared/i18n/useI18n';
import type { MouseEvent } from 'react';
import type { DerivedFinancialAccount } from '../lib/accounts';

interface AccountCardProps {
  account: DerivedFinancialAccount;
  isSelected?: boolean;
  onEdit: (account: DerivedFinancialAccount) => void;
  onDelete: (account: DerivedFinancialAccount) => void;
  onSetDefault: (account: DerivedFinancialAccount) => void;
}

const ACCOUNT_ICONS: Record<string, LucideIcon> = {
  checking: Landmark,
  savings: PiggyBank,
  credit: CreditCard,
  cash: Coins,
  investment: Landmark,
};

const getAccountTypeLabel = (type: string, t: (key: string) => string) => {
  switch (type) {
    case 'checking':
      return t('finances.accountTypeChecking');
    case 'savings':
      return t('finances.accountTypeSavings');
    case 'credit':
      return t('finances.accountTypeCredit');
    case 'cash':
      return t('finances.accountTypeCash');
    case 'investment':
      return t('finances.accountTypeInvestment');
    default:
      return type;
  }
};

export function AccountCard({ account, isSelected = false, onEdit, onDelete, onSetDefault }: AccountCardProps) {
  const Icon = ACCOUNT_ICONS[account.type] || Landmark;
  const { t } = useI18n();
  const handleAction = (event: MouseEvent<HTMLButtonElement>, callback: () => void) => {
    event.stopPropagation();
    callback();
  };

  return (
    <motion.div
      whileHover={{ y: -4, borderColor: 'var(--color-border)' }}
      className={`bg-bg-card border rounded-2xl p-5 cursor-pointer transition-all group hover-card relative overflow-hidden ${
        isSelected ? 'border-violet-500 ring-2 ring-violet-500/60' : 'border-border/50'
      }`}
    >
      <div className="flex items-center gap-4 relative z-10">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
          style={{ background: `${account.color}15`, color: account.color }}
        >
          <Icon size={24} />
        </div>
        <div>
          <h3 className="font-bold text-text-primary group-hover:text-violet-400 transition-colors uppercase tracking-tight text-sm">{account.name}</h3>
          <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">{getAccountTypeLabel(account.type, t)}</p>
        </div>
      </div>
      
      <div className="mt-4 relative z-10 space-y-3">
        <div className="text-xl font-mono font-bold text-text-primary tracking-tight">
          {formatCurrency(account.derivedBalance, account.currency)}
        </div>
        <div className="flex flex-wrap gap-2">
          {account.isDefault && (
            <span className="inline-flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-violet-300">
              <Star size={10} />
              {t('finances.defaultAccount')}
            </span>
          )}
          <span className="inline-flex items-center rounded-full border border-border/70 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-text-muted">
            {account.currency}
          </span>
        </div>
      </div>

      <div className="relative z-10 mt-4 flex gap-2">
        <Button variant="ghost" size="sm" className="flex-1" onClick={(event) => handleAction(event, () => onEdit(account))} leftIcon={<Pencil size={14} />}>
          {t('common.edit')}
        </Button>
        <Button variant={account.isDefault ? 'primary' : 'ghost'} size="sm" className="flex-1" onClick={(event) => handleAction(event, () => onSetDefault(account))} leftIcon={<Star size={14} />}>
          {t('finances.defaultAccount')}
        </Button>
        <Button variant="ghost" size="sm" className="text-rose-400 hover:bg-rose-500/10" onClick={(event) => handleAction(event, () => onDelete(account))} leftIcon={<Trash2 size={14} />}>
          {t('finances.deleteAccount')}
        </Button>
      </div>

      {/* Subtle indicator */}
      <div 
        className="absolute top-0 right-0 w-24 h-24 opacity-5 blur-3xl rounded-full"
        style={{ backgroundColor: account.color }}
      />
    </motion.div>
  );
}
