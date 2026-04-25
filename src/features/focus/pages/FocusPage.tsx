import { useAppStore } from '../../../stores/useAppStore';
import { FocusEmptyState } from '../components/FocusEmptyState';
import { FocusHeader } from '../components/FocusHeader';
import { FocusInterruptionsCard } from '../components/FocusInterruptionsCard';
import { FocusLayoutCards } from '../components/FocusLayoutCards';
import { FocusMetricsDetailCard } from '../components/FocusMetricsDetailCard';
import { FocusSessionComposer } from '../components/FocusSessionComposer';
import { FocusTimerCard } from '../components/FocusTimerCard';

export function FocusPage() {
  const tasks = useAppStore((state) => state.tasks);
  const sessions = useAppStore((state) => state.focusSessions);
  const addFocusSession = useAppStore((state) => state.addFocusSession);
  const selectedFocusSessionId = useAppStore((state) => state.selectedFocusSessionId);
  const pauseFocusSession = useAppStore((state) => state.pauseFocusSession);
  const resumeFocusSession = useAppStore((state) => state.resumeFocusSession);
  const finishFocusSession = useAppStore((state) => state.finishFocusSession);
  const updateFocusSession = useAppStore((state) => state.updateFocusSession);

  const selectedSession =
    sessions.find((session) => session.id === selectedFocusSessionId) ??
    sessions.find((session) => session.status === 'active' || session.status === 'paused') ??
    null;

  const handleAddInterruption = (sessionId: string, note: string) => {
    const session = sessions.find((item) => item.id === sessionId);
    if (!session) return;

    updateFocusSession(sessionId, {
      interruptionCount: session.interruptionCount + 1,
      interruptionNotes: note
        ? [...session.interruptionNotes, note]
        : session.interruptionNotes,
    });
  };

  return (
    <div className="space-y-6">
      <FocusHeader />
      <FocusMetricsDetailCard sessions={sessions} />
      <FocusSessionComposer tasks={tasks} onCreateSession={addFocusSession} />
      <FocusTimerCard
        session={selectedSession}
        onPause={pauseFocusSession}
        onResume={resumeFocusSession}
        onFinish={finishFocusSession}
      />
      <FocusInterruptionsCard
        session={selectedSession}
        onAddInterruption={handleAddInterruption}
      />
      <FocusLayoutCards sessions={sessions} />
      {sessions.length === 0 ? <FocusEmptyState /> : null}
    </div>
  );
}
