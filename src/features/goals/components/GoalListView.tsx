import { GoalCard } from './GoalCard';
import type { PersonalGoal } from '../types';

interface GoalListViewProps {
  goals: PersonalGoal[];
  onEdit: (goal: PersonalGoal) => void;
  onDelete: (goal: PersonalGoal) => void;
  getRelatedTaskCount: (goalId: string) => number;
}

export function GoalListView({ goals, onEdit, onDelete, getRelatedTaskCount }: GoalListViewProps) {
  return (
    <div className="space-y-4">
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} onEdit={onEdit} onDelete={onDelete} relatedTaskCount={getRelatedTaskCount(goal.id)} />
      ))}
    </div>
  );
}
