import { motion } from 'framer-motion';
import type { Budget } from '../../../shared/types';
import { cn } from '../../../shared/lib/cn';

interface BudgetProgressProps {
  budget: Budget;
}

export function BudgetProgress({ budget }: BudgetProgressProps) {
  const percent = Math.min((budget.spent / budget.amount) * 100, 100);
  const isHigh = percent >= budget.alertThreshold;
  
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: budget.color }} />
          <span className="text-sm font-semibold text-text-primary">{budget.category}</span>
        </div>
        <div className="text-xs text-text-muted font-mono">
          <span className={cn("font-bold text-text-primary", isHigh && "text-rose-400")}>
            {formatCurrency(budget.spent)}
          </span>
          {" / "}
          {formatCurrency(budget.amount)}
        </div>
      </div>
      
      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          className={cn(
            "h-full rounded-full transition-all duration-1000",
            percent > 100 ? "bg-rose-500" : isHigh ? "bg-amber-500" : "bg-violet-500"
          )}
          style={{ 
            backgroundColor: percent <= 100 ? budget.color : undefined,
            boxShadow: `0 0 10px ${budget.color}40` 
          }}
        />
      </div>
      
      {percent > 100 && (
        <p className="text-[10px] text-rose-400 font-bold uppercase tracking-tight">Budget exceeded</p>
      )}
    </div>
  );
}
