import { motion } from 'framer-motion';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { DashboardHeader } from '../components/DashboardHeader';
import { KPIGrid } from '../components/KPIGrid';
import { HabitsWidget } from '../components/HabitsWidget';
import { UpcomingEventsWidget } from '../components/UpcomingEventsWidget';
import { FinanceWidgets } from '../components/FinanceWidgets';
import { ActivityWidget } from '../components/ActivityWidget';
import { AchievementsWidget } from '../components/AchievementsWidget';

export function Dashboard() {
  const {
    today,
    tasksCompletedToday,
    totalTasksToday,
    todayHabits,
    completedHabits,
    habitCompletionRate,
    maxStreak,
    longestEver,
    netWorth,
    netWorthTrend,
    isTrendPositive,
    TrendIcon,
    balanceHistory,
    notesThisWeek,
    weeklyScore,
    upcomingEvents,
    activities,
    setActiveModule,
    logHabit,
  } = useDashboardStats();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <DashboardHeader weeklyScore={weeklyScore} />

      <KPIGrid
        tasksCompletedToday={tasksCompletedToday}
        totalTasksToday={totalTasksToday}
        maxStreak={maxStreak}
        longestEver={longestEver}
        netWorth={netWorth}
        notesThisWeek={notesThisWeek}
        setActiveModule={setActiveModule}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <HabitsWidget
          habitCompletionRate={habitCompletionRate}
          completedHabits={completedHabits}
          todayHabits={todayHabits}
          today={today}
          setActiveModule={setActiveModule}
          logHabit={logHabit}
        />

        <UpcomingEventsWidget
          upcomingEvents={upcomingEvents}
          setActiveModule={setActiveModule}
        />
      </div>

      <FinanceWidgets
        isTrendPositive={isTrendPositive}
        netWorthTrend={netWorthTrend}
        TrendIcon={TrendIcon}
        balanceHistory={balanceHistory}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ActivityWidget activities={activities} />

        <AchievementsWidget
          maxStreak={maxStreak}
          tasksCompletedToday={tasksCompletedToday}
          notesThisWeek={notesThisWeek}
          netWorth={netWorth}
          completedHabits={completedHabits}
          weeklyScore={weeklyScore}
        />
      </div>
    </motion.div>
  );
}
