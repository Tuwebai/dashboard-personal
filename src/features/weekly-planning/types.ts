export interface WeeklyPlanningState {
  weeklyFocus: string;
  weeklyFocusGoalId: string;
  weeklyTopPriorities: string[];
  weeklyPriorityTaskIds: string[];
  weeklyNotes: string;
  dailyTop3: string[];
  dailyHighlightedTaskIds: string[];
  dailyIntention: string;
  dailyQuickNotes: string;
}
