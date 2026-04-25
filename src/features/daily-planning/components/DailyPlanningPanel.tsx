import { useMemo } from 'react';
import { format } from 'date-fns';
import { useAppStore } from '../../../stores/useAppStore';
import type { Task } from '../../../shared/types';
import { DailyHighlightedTasksCard } from './DailyHighlightedTasksCard';
import { DailyNotesCards } from './DailyNotesCards';
import { DailySuggestionsCard } from './DailySuggestionsCard';
import { DailyTop3Card } from './DailyTop3Card';
import { usePlanningAutosaveToast } from '../../weekly-planning/hooks/usePlanningAutosaveToast';

export function DailyPlanningPanel() {
  const scheduleSavedToast = usePlanningAutosaveToast();
  const setActiveModule = useAppStore((state) => state.setActiveModule);
  const tasks = useAppStore((state) => state.tasks);
  const dailyTop3 = useAppStore((state) => state.dailyTop3);
  const dailyHighlightedTaskIds = useAppStore((state) => state.dailyHighlightedTaskIds);
  const dailyIntention = useAppStore((state) => state.dailyIntention);
  const dailyQuickNotes = useAppStore((state) => state.dailyQuickNotes);
  const weeklyPriorityTaskIds = useAppStore((state) => state.weeklyPriorityTaskIds);
  const setDailyTop3 = useAppStore((state) => state.setDailyTop3);
  const setDailyHighlightedTask = useAppStore((state) => state.setDailyHighlightedTask);
  const setDailyIntention = useAppStore((state) => state.setDailyIntention);
  const setDailyQuickNotes = useAppStore((state) => state.setDailyQuickNotes);
  const completeTask = useAppStore((state) => state.completeTask);
  const moveTask = useAppStore((state) => state.moveTask);
  const setWeeklyPriorityTask = useAppStore((state) => state.setWeeklyPriorityTask);
  const setSelectedTask = useAppStore((state) => state.setSelectedTask);
  const setJournalingContextDate = useAppStore((state) => state.setJournalingContextDate);
  const addFocusSession = useAppStore((state) => state.addFocusSession);

  const suggestedTasks = useMemo(
    () => tasks.filter((task) => task.status !== 'done').slice(0, 5),
    [tasks],
  );

  const highlightedTasks = useMemo(
    () =>
      dailyHighlightedTaskIds
        .map((taskId, index) => ({
          slot: index,
          task: tasks.find((item) => item.id === taskId) ?? null,
        }))
        .filter((item) => item.task),
    [dailyHighlightedTaskIds, tasks],
  );

  const firstAvailableWeeklySlot = weeklyPriorityTaskIds.findIndex((taskId) => !taskId);
  const firstAvailableDailySlot = dailyHighlightedTaskIds.findIndex((taskId) => !taskId);

  const openTaskDetail = (taskId: string) => {
    setSelectedTask(taskId);
    setActiveModule('tasks');
  };

  const openJournaling = () => {
    setJournalingContextDate(format(new Date(), 'yyyy-MM-dd'));
    setActiveModule('journaling');
  };

  const startFocusSession = (task: Task) => {
    const now = new Date();
    addFocusSession({
      title: task.title,
      mode: 'pomodoro',
      plannedMinutes: 25,
      linkedTaskId: task.id,
      status: 'active',
      interruptionCount: 0,
      interruptionNotes: [],
      linkedDate: format(now, 'yyyy-MM-dd'),
      elapsedSeconds: 0,
      startedAt: now.toISOString(),
      lastResumedAt: now.toISOString(),
    });
    setActiveModule('focus');
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <DailyTop3Card
        dailyTop3={dailyTop3}
        dailyHighlightedTaskIds={dailyHighlightedTaskIds}
        suggestedTasks={suggestedTasks}
        setDailyTop3={setDailyTop3}
        setDailyHighlightedTask={setDailyHighlightedTask}
        onSaved={scheduleSavedToast}
      />

      <DailyNotesCards
        dailyIntention={dailyIntention}
        dailyQuickNotes={dailyQuickNotes}
        setDailyIntention={setDailyIntention}
        setDailyQuickNotes={setDailyQuickNotes}
        onOpenJournaling={openJournaling}
        onSaved={scheduleSavedToast}
      />

      <DailyHighlightedTasksCard
        highlightedTasks={highlightedTasks}
        firstAvailableWeeklySlot={firstAvailableWeeklySlot}
        completeTask={completeTask}
        moveTask={moveTask}
        setWeeklyPriorityTask={setWeeklyPriorityTask}
        openTaskDetail={openTaskDetail}
        startFocusSession={startFocusSession}
      />

      <DailySuggestionsCard
        suggestedTasks={suggestedTasks}
        dailyHighlightedTaskIds={dailyHighlightedTaskIds}
        firstAvailableDailySlot={firstAvailableDailySlot}
        moveTask={moveTask}
        setDailyHighlightedTask={setDailyHighlightedTask}
        openTaskDetail={openTaskDetail}
        startFocusSession={startFocusSession}
      />
    </div>
  );
}
