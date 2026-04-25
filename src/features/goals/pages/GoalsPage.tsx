import { useState } from 'react';
import { useAppStore } from '../../../stores/useAppStore';
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
  const personalGoals = useAppStore((state) => state.personalGoals);
  const tasks = useAppStore((state) => state.tasks);
  const goalFilters = useAppStore((state) => state.goalFilters);
  const setGoalFilters = useAppStore((state) => state.setGoalFilters);
  const goalView = useAppStore((state) => state.goalView);
  const setGoalView = useAppStore((state) => state.setGoalView);
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

  const getRelatedTasks = (goalId: string) => tasks.filter((task) => task.goalId === goalId && !task.isArchived);
  const getRelatedTaskCount = (goalId: string) => getRelatedTasks(goalId).length;

  return (
    <div className="space-y-6 page-enter pb-6">
      <GoalsHeader onCreate={handleCreate} />
      <GoalToolbar filters={goalFilters} setFilters={setGoalFilters} view={goalView} setView={setGoalView} />

      {hasGoals ? (
        <section>
          {goalView === 'kanban' && <GoalKanbanView goals={filteredGoals} onEdit={handleEdit} getRelatedTaskCount={getRelatedTaskCount} />}
          {goalView === 'list' && <GoalListView goals={filteredGoals} onEdit={handleEdit} getRelatedTaskCount={getRelatedTaskCount} />}
          {goalView === 'matrix' && <GoalMatrixView goals={filteredGoals} onEdit={handleEdit} getRelatedTaskCount={getRelatedTaskCount} />}
          {goalView === 'table' && <GoalTableView goals={filteredGoals} onEdit={handleEdit} getRelatedTaskCount={getRelatedTaskCount} />}
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
