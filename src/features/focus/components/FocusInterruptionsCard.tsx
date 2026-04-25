import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { useI18n } from '../../../shared/i18n/useI18n';
import type { FocusSession } from '../types';

interface FocusInterruptionsCardProps {
  session: FocusSession | null;
  onAddInterruption: (sessionId: string, note: string) => void;
}

export function FocusInterruptionsCard({
  session,
  onAddInterruption,
}: FocusInterruptionsCardProps) {
  const { t } = useI18n();
  const [note, setNote] = useState('');

  const handleAdd = () => {
    if (!session) return;
    onAddInterruption(session.id, note.trim());
    setNote('');
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-amber-500/15 p-3 text-amber-300">
          <AlertTriangle size={20} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">{t('focus.interruptions.title')}</h2>
          <p className="mt-1 text-xs text-white/35">
            {session
              ? t('focus.interruptions.count').replace('{count}', String(session.interruptionCount))
              : t('focus.interruptions.empty')}
          </p>
        </div>
      </div>

      {session ? (
        <div className="mt-5 space-y-4">
          <Input
            label={t('focus.interruptions.note')}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder={t('focus.interruptions.placeholder')}
          />
          <Button onClick={handleAdd} variant="secondary" className="w-full sm:w-auto">
            {t('focus.interruptions.add')}
          </Button>
        </div>
      ) : null}
    </section>
  );
}
