import { SlideOver } from '../../../shared/ui/Modal';
import { BarChart3 } from 'lucide-react';
import { useAppStore } from '../../../stores/useAppStore';
import { useI18n } from '../../../shared/i18n/useI18n';
import { parseStoredDate } from '../../../shared/lib/date';

interface FinancialAnalysisSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FinancialAnalysisSlideOver({ isOpen, onClose }: FinancialAnalysisSlideOverProps) {
  const { t } = useI18n();
  const transactions = useAppStore((state) => state.transactions);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyTx = transactions.filter(tx => {
    const d = parseStoredDate(tx.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const income = monthlyTx.filter(tx => tx.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const expenses = monthlyTx.filter(tx => tx.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const projectedSavings = (income - expenses) * 12;

  // Aggregate by category
  const categoriesMap: Record<string, number> = {};
  monthlyTx.filter(tx => tx.type === 'expense').forEach(tx => {
    categoriesMap[tx.category] = (categoriesMap[tx.category] || 0) + tx.amount;
  });

  const categoryEntries = Object.entries(categoriesMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const totalMonthlyExpenses = expenses || 1; // avoid division by zero

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  const topCategory = categoryEntries[0]?.[0] || 'expenses';

  return (
    <SlideOver isOpen={isOpen} onClose={onClose} title={t('finances.analysis')} width="w-full sm:w-[450px]">
      <div className="space-y-8">
        <div className="p-6 bg-linear-to-br from-violet-600/20 to-cyan-600/20 border border-violet-500/20 rounded-3xl">
          <h4 className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-2">Projected Yearly Savings</h4>
          <p className="text-2xl font-bold text-text-primary">{formatCurrency(projectedSavings)}</p>
          <p className="text-[11px] text-text-secondary mt-1">Based on your current monthly spending patterns.</p>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-text-primary px-1 flex items-center gap-2">
            <BarChart3 size={16} className="text-violet-400" />
            Spending by Category
          </h4>
          <div className="space-y-3">
            {categoryEntries.length > 0 ? categoryEntries.map(([cat, amount]) => {
              const percent = Math.round((amount / totalMonthlyExpenses) * 100);
              return (
                <div key={cat} className="p-4 bg-white/5 rounded-2xl border border-border flex items-center justify-between group hover:bg-white/10 transition-all">
                  <span className="text-sm text-text-primary font-medium">{cat}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-violet-500 rounded-full transition-all duration-1000" 
                        style={{ width: `${percent}%` }} 
                      />
                    </div>
                    <span className="text-xs font-bold text-text-primary w-8 text-right">{percent}%</span>
                  </div>
                </div>
              );
            }) : (
              <div className="p-8 text-center text-text-muted text-xs opacity-50 border border-dashed border-border rounded-2xl">
                No expense data for this month
              </div>
            )}
          </div>
        </div>

        <div className="p-5 bg-white/3 rounded-2xl border border-border border-dashed">
          <h5 className="text-xs font-bold text-text-primary mb-2">Analysis Insight</h5>
          <p className="text-[11px] text-text-secondary leading-relaxed opacity-70">
            {expenses > 0 
              ? `Consider monitoring your '${topCategory}' expenses more closely. Reducing this by 10% could add ${formatCurrency(categoriesMap[topCategory] * 0.1)} to your monthly savings.`
              : "Start adding your transactions to see personalized financial insights and spending patterns."
            }
          </p>
        </div>
      </div>
    </SlideOver>
  );
}
