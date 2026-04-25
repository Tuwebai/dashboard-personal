import { format } from 'date-fns';
import { useI18n } from '../../../shared/i18n/useI18n';
import type { JournalEntry } from '../types';

interface JournalEntryListProps {
  entries: JournalEntry[];
  emptyMessage: string;
}

export function JournalEntryList({ entries, emptyMessage }: JournalEntryListProps) {
  const { t } = useI18n();

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20">
      <div className="space-y-4">
        {entries.length > 0 ? (
          entries.map((entry) => (
            <article key={entry.id} className="rounded-2xl border border-white/10 bg-black/10 p-5">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-sm font-semibold text-white">{entry.title || t('journaling.untitled')}</h3>
                <span className="text-xs text-white/35">
                  {format(new Date(entry.createdAt), 'dd/MM/yyyy')}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-[11px] font-medium text-violet-200">
                  {entry.mood}
                </span>
                {entry.linkedDate ? (
                  <span className="rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-1 text-[11px] font-medium text-sky-100">
                    {entry.linkedDate}
                  </span>
                ) : null}
                {entry.linkedArea ? (
                  <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-100">
                    {entry.linkedArea}
                  </span>
                ) : null}
                {entry.tags.map((tag) => (
                  <span
                    key={`${entry.id}-${tag}`}
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/60"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-white/70">{entry.content}</p>
            </article>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 p-5 text-sm text-white/45">
            {emptyMessage}
          </div>
        )}
      </div>
    </section>
  );
}
