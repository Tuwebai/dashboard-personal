export type GoalHorizon = 'weekly' | 'monthly' | 'quarterly' | 'yearly';
export type GoalPriority = 'low' | 'medium' | 'high' | 'critical';
export type GoalStatus = 'planned' | 'active' | 'paused' | 'completed';

export interface PersonalGoal {
  id: string;
  title: string;
  description: string;
  horizon: GoalHorizon;
  priority: GoalPriority;
  status: GoalStatus;
  progress: number;
  createdAt: string;
}
