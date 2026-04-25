import { motion } from 'framer-motion';
import { Landmark, CreditCard, Coins, PiggyBank, type LucideIcon } from 'lucide-react';
import type { FinancialAccount } from '../../../shared/types';

interface AccountCardProps {
  account: FinancialAccount;
}

const ACCOUNT_ICONS: Record<string, LucideIcon> = {
  checking: Landmark,
  savings: PiggyBank,
  credit: CreditCard,
  cash: Coins,
  investment: Landmark,
};

export function AccountCard({ account }: AccountCardProps) {
  const Icon = ACCOUNT_ICONS[account.type] || Landmark;
  
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <motion.div
      whileHover={{ y: -4, borderColor: 'var(--color-border)' }}
      className="bg-bg-card border border-border/50 rounded-2xl p-5 cursor-pointer transition-all group hover-card relative overflow-hidden"
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
          <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">{account.type}</p>
        </div>
      </div>
      
      <div className="mt-4 relative z-10">
        <div className="text-xl font-mono font-bold text-text-primary tracking-tight">
          {formatCurrency(account.balance)}
        </div>
      </div>

      {/* Subtle indicator */}
      <div 
        className="absolute top-0 right-0 w-24 h-24 opacity-5 blur-3xl rounded-full"
        style={{ backgroundColor: account.color }}
      />
    </motion.div>
  );
}
