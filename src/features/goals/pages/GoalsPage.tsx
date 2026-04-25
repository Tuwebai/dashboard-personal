import { useState } from 'react';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '../../../stores/useAppStore';
import { useI18n } from '../../../shared/i18n/useI18n';
import { GoalEmptyState } from '../components/GoalEmptyState';
import { GoalKanbanView } from '../components/GoalKanbanView';
import { GoalListView } from '../components/GoalListView';
import { GoalMatrixView } from '../components/GoalMatrixView';
import { GoalModal } from '../components/GoalModal';
import { GoalTableView } from '../components/GoalTableView';
import { GoalToolbar } from '../components/GoalToolbar';
import { GoalsHeader } from '../components/GoalsHeader';
import type { PersonalGoal } from '../types';

export function GoalsPage() {
  const { t } = useI18n();
  const { personalGoals, tasks, goalFilters, setGoalFilters, goalView, setGoalView, deletePersonalGoal } = useAppStore(
    useShallow((state) => ({
      personalGoals: state.personalGoals,
      tasks: state.tasks,
      goalFilters: state.goalFilters,
      setGoalFilters: state.setGoalFilters,
      goalView: state.goalView,
      setGoalView: state.setGoalView,
      deletePersonalGoal: state.deletePersonalGoal,
    }))
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<PersonalGoal | null>(null);
  const filteredGoals = personalGoals.filter((goal) => {
    if (goalFilters.horizon && goal.horizon !== goalFilters.horizon) return false;
    if (goalFilters.status && goal.status !== goalFilters.status) return false;
    if (goalFilters.priority && goal.priority !== goalFilters.priority) return false;
    return true;
  });
  const hasGoals = filteredGoals.length > 0;

  const handleCreate = () => {
    setEditingGoal(null);
    setIsModalOpen(true);
  };

  const handleEdit = (goal: PersonalGoal) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  const handleDelete = (goal: PersonalGoal) => {
    deletePersonalGoal(goal.id);
    if (editingGoal?.id === goal.id) {
      setEditingGoal(null);
      setIsModalOpen(false);
    }
    toast.success(t('goals.deleted'));
  };

  const getRelatedTasks = (goalId: string) => tasks.filter((task) => task.goalId === goalId && !task.isArchived);
  const getRelatedTaskCount = (goalId: string) => getRelatedTasks(goalId).length;

  return (
    <div className="space-y-6 page-enter pb-6">
      <GoalsHeader onCreate={handleCreate} />
      <GoalToolbar filters={goalFilters} setFilters={setGoalFilters} view={goalView} setView={setGoalView} />

      {hasGoals ? (
        <section>
          {goalView === 'kanban' && (
            <GoalKanbanView goals={filteredGoals} onEdit={handleEdit} onDelete={handleDelete} getRelatedTaskCount={getRelatedTaskCount} />
          )}
          {goalView === 'list' && (
            <GoalListView goals={filteredGoals} onEdit={handleEdit} onDelete={handleDelete} getRelatedTaskCount={getRelatedTaskCount} />
          )}
          {goalView === 'matrix' && (
            <GoalMatrixView goals={filteredGoals} onEdit={handleEdit} onDelete={handleDelete} getRelatedTaskCount={getRelatedTaskCount} />
          )}
          {goalView === 'table' && (
            <GoalTableView goals={filteredGoals} onEdit={handleEdit} onDelete={handleDelete} getRelatedTaskCount={getRelatedTaskCount} />
          )}
        </section>
      ) : (
        <GoalEmptyState />
      )}

      <GoalModal
        isOpen={isModalOpen}
        goal={editingGoal}
        relatedTasks={editingGoal ? getRelatedTasks(editingGoal.id) : []}
        onClose={() => {
          setIsModalOpen(false);
          setEditingGoal(null);
        }}
      />
    </div>
  );
}
