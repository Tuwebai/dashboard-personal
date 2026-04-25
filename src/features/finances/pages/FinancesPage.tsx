import { useState } from 'react';
import { Plus, Download, Filter, BarChart3, Settings2 } from 'lucide-react';
import { Button } from '../../../shared/ui/Button';
import { FinanceSummary } from '../components/FinanceSummary';
import { AccountCard } from '../components/AccountCard';
import { BudgetProgress } from '../components/BudgetProgress';
import { TransactionTable } from '../components/TransactionTable';
import { TransactionDetailModal } from '../components/TransactionDetailModal';
import { AddTransactionModal } from '../components/AddTransactionModal';
import { BudgetManagerSlideOver } from '../components/BudgetManagerSlideOver';
import { FinancialAnalysisSlideOver } from '../components/FinancialAnalysisSlideOver';
import { useAppStore } from '../../../stores/useAppStore';
import { cn } from '../../../shared/lib/cn';
import { Transaction } from '../../../shared/types';
import { useI18n } from '../../../shared/i18n/useI18n';

export default function Finances() {
  const { accounts, budgets } = useAppStore();
  const { t } = useI18n();
  
  // UI State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showBudgetManager, setShowBudgetManager] = useState(false);

  return (
    <div className="space-y-8 page-enter pb-12 text-scrollbar">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">{t('finances.title')}</h1>
          <p className="text-text-secondary mt-1">{t('finances.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="bg-bg-secondary border-border" leftIcon={<Download size={16} />}>
            {t('finances.export')}
          </Button>
          <Button 
            variant="primary" 
            className="shadow-lg shadow-violet/20 font-bold" 
            leftIcon={<Plus size={16} />}
            onClick={() => setIsAddModalOpen(true)}
          >
            {t('finances.addTransaction')}
          </Button>
        </div>
      </div>

      <FinanceSummary />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xl font-bold text-text-primary">{t('finances.accounts')}</h2>
              {selectedAccountId && (
                <Button variant="ghost" size="sm" className="text-violet-400" onClick={() => setSelectedAccountId(null)}>{t('finances.clearFilter')}</Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {accounts.map(account => (
                <div 
                  key={account.id} 
                  onClick={() => setSelectedAccountId(account.id)}
                  className={cn(
                    "cursor-pointer rounded-2xl transition-all h-fit",
                    selectedAccountId === account.id ? "ring-2 ring-violet-500 scale-[1.02]" : "hover:scale-[1.01]"
                  )}
                >
                  <AccountCard account={account} />
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xl font-bold text-text-primary">
                {selectedAccountId ? `${t('finances.transactionsFor')} ${accounts.find(a => a.id === selectedAccountId)?.name}` : t('finances.recentTransactions')}
              </h2>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" leftIcon={<Filter size={14} />}>{t('finances.filter')}</Button>
              </div>
            </div>
            <TransactionTable 
              limit={15} 
              accountId={selectedAccountId || undefined} 
              onRowClick={setSelectedTx}
            />
          </section>
        </div>

        <div className="space-y-8">
          <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xl font-bold text-text-primary">{t('finances.monthlyBudgets')}</h2>
              <button 
                onClick={() => setShowBudgetManager(true)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted transition-all"
              >
                <Settings2 size={16} />
              </button>
            </div>
            <div className="bg-bg-secondary border border-border rounded-3xl p-6 glass space-y-6">
              {budgets.map(budget => (
                <BudgetProgress key={budget.id} budget={budget} />
              ))}
              <Button 
                variant="ghost" 
                className="w-full border-dashed border-border mt-2 rounded-2xl" 
                onClick={() => setShowBudgetManager(true)}
              >
                {t('finances.manageBudgets')}
              </Button>
            </div>
          </section>

          <section className="bg-linear-to-br from-violet-600/20 to-cyan-600/20 border border-violet-500/20 rounded-3xl p-6 glass relative overflow-hidden group">
             <div className="relative z-10">
               <h3 className="font-bold text-text-primary">{t('finances.wealthInsights')}</h3>
               <p className="text-sm text-text-secondary mt-2 leading-relaxed opacity-80">{t('finances.wealthInsightsDesc')}</p>
               <Button 
                variant="primary" 
                size="sm" 
                className="mt-4 bg-white text-black hover:bg-white/90 border-none px-6 shadow-xl" 
                leftIcon={<BarChart3 size={14} />}
                onClick={() => setShowAnalysis(true)}
               >
                 Analysis
               </Button>
             </div>
             <div className="absolute -right-4 -bottom-4 opacity-10 blur-2xl w-32 h-32 bg-violet-500 rounded-full group-hover:opacity-20 transition-all" />
          </section>
        </div>
      </div>

      {/* Modals & SlideOvers */}
      <AddTransactionModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />

      <TransactionDetailModal 
        transaction={selectedTx} 
        isOpen={!!selectedTx} 
        onClose={() => setSelectedTx(null)} 
      />

      <FinancialAnalysisSlideOver 
        isOpen={showAnalysis} 
        onClose={() => setShowAnalysis(false)} 
      />

      <BudgetManagerSlideOver 
        isOpen={showBudgetManager} 
        onClose={() => setShowBudgetManager(false)} 
      />
    </div>
  );
}
