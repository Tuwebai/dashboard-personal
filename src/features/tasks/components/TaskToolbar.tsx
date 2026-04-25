import { 
  Search, LayoutGrid, List, Filter, Table2 
} from 'lucide-react';
import { Input, Select } from '../../../shared/ui/Input';
import { cn } from '../../../shared/lib/cn';
import { KANBAN_COLUMNS } from '../../../shared/lib/helpers';
import type { TaskView } from '../../../shared/types';
import { useI18n } from '../../../shared/i18n/useI18n';

const VIEW_ICONS = {
  kanban: LayoutGrid,
  list: List,
  matrix: Filter,
  table: Table2,
};

interface TaskToolbarProps {
  filters: {
    search: string;
    priority: string;
    status: string;
  };
  setFilters: (filters: Partial<{ search: string; priority: string; status: string }>) => void;
  view: TaskView;
  setView: (view: TaskView) => void;
}

export function TaskToolbar({ filters, setFilters, view, setView }: TaskToolbarProps) {
  const { t } = useI18n();
  const priorityOptions = [
    { value: '', label: t('tasks.allPriorities') },
    { value: 'critical', label: `🔴 ${t('tasks.priorityCritical')}` },
    { value: 'high', label: `🟠 ${t('tasks.priorityHigh')}` },
    { value: 'medium', label: `🟡 ${t('tasks.priorityMedium')}` },
    { value: 'low', label: `🟢 ${t('tasks.priorityLow')}` },
  ];
  const statusLabels = {
    backlog: t('tasks.statusBacklog'),
    todo: t('tasks.statusTodo'),
    in_progress: t('tasks.statusInProgress'),
    review: t('tasks.statusReview'),
    done: t('tasks.statusDone'),
  } as const;
  return (
    <div className="flex items-center gap-3 flex-shrink-0 flex-wrap">
      <div className="flex-1 min-w-48">
        <Input
          leftIcon={<Search size={16} />}
          placeholder={t('tasks.search')}
          value={filters.search}
          onChange={e => setFilters({ search: e.target.value })}
          className="h-11 shadow-sm"
        />
      </div>
      
      <div className="flex items-center gap-2">
        <Select
          options={priorityOptions}
          value={filters.priority}
          onChange={e => setFilters({ priority: e.target.value })}
          className="w-44 h-11"
        />
        
        <Select
          options={[
            { value: '', label: t('tasks.allStatuses') },
            ...KANBAN_COLUMNS.map(c => ({ value: c.id, label: statusLabels[c.id] }))
          ]}
          value={filters.status}
          onChange={e => setFilters({ status: e.target.value })}
          className="w-44 h-11"
        />

        {/* View Toggle */}
        <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1.5 shadow-inner">
          {(Object.keys(VIEW_ICONS) as TaskView[]).map(v => {
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
