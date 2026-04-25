import { LayoutGrid, List, Filter, Table2, Target } from 'lucide-react';
import { cn } from '../../../shared/lib/cn';
import { Select } from '../../../shared/ui/Input';
import type { TaskView } from '../../../shared/types';
import { useI18n } from '../../../shared/i18n/useI18n';

const VIEW_ICONS = {
  kanban: LayoutGrid,
  list: List,
  matrix: Filter,
  table: Table2,
} as const;

interface GoalToolbarProps {
  filters: {
    horizon: string;
    status: string;
    priority: string;
  };
  setFilters: (filters: Partial<{ horizon: string; status: string; priority: string }>) => void;
  view: TaskView;
  setView: (view: TaskView) => void;
}

export function GoalToolbar({ filters, setFilters, view, setView }: GoalToolbarProps) {
  const { t } = useI18n();
  return (
    <div className="flex items-center gap-3 flex-shrink-0 flex-wrap">
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 h-11 text-white/45">
        <Target size={16} />
        <span className="text-sm">{t('goals.objectivesLabel')}</span>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <Select
          options={[
            { value: '', label: t('goals.allHorizons') },
            { value: 'weekly', label: t('goals.horizonWeekly') },
            { value: 'monthly', label: t('goals.horizonMonthly') },
            { value: 'quarterly', label: t('goals.horizonQuarterly') },
            { value: 'yearly', label: t('goals.horizonYearly') },
          ]}
          value={filters.horizon}
          onChange={(e) => setFilters({ horizon: e.target.value })}
          className="w-44 h-11"
        />

        <Select
          options={[
            { value: '', label: t('goals.allStatuses') },
            { value: 'planned', label: t('goals.statusPlanned') },
            { value: 'active', label: t('goals.statusActive') },
            { value: 'paused', label: t('goals.statusPaused') },
            { value: 'completed', label: t('goals.statusCompleted') },
          ]}
          value={filters.status}
          onChange={(e) => setFilters({ status: e.target.value })}
          className="w-44 h-11"
        />

        <Select
          options={[
            { value: '', label: t('goals.allPriorities') },
            { value: 'critical', label: `🔴 ${t('goals.priorityCritical')}` },
            { value: 'high', label: `🟠 ${t('goals.priorityHigh')}` },
            { value: 'medium', label: `🟡 ${t('goals.priorityMedium')}` },
            { value: 'low', label: `🟢 ${t('goals.priorityLow')}` },
          ]}
          value={filters.priority}
          onChange={(e) => setFilters({ priority: e.target.value })}
          className="w-44 h-11"
        />

        <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1.5 shadow-inner">
          {(Object.keys(VIEW_ICONS) as TaskView[]).map((v) => {
            const Icon = VIEW_ICONS[v];
            return (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  'p-2 rounded-lg transition-all duration-300',
                  view === v
                    ? 'bg-violet-500/20 text-violet-400 shadow-sm'
                    : 'text-white/30 hover:text-white/60 hover:bg-white/5'
                )}
                aria-label={`${v} ${t('common.view')}`}
                type="button"
              >
                <Icon size={18} strokeWidth={2.5} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
