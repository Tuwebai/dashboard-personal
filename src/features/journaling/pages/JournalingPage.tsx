import { useMemo, useState } from 'react';
import { BookOpenText } from 'lucide-react';
import { toast } from 'sonner';
import { useI18n } from '../../../shared/i18n/useI18n';
import { Select, Input } from '../../../shared/ui/Input';
import { useAppStore } from '../../../stores/useAppStore';
import { JournalEntryComposer } from '../components/JournalEntryComposer';
import { JournalEntryList } from '../components/JournalEntryList';
import { JournalFilterBar } from '../components/JournalFilterBar';
import type { JournalEntry } from '../types';

const MOOD_OPTIONS = [
  { value: 'clear', labelKey: 'journaling.moodClear' },
  { value: 'steady', labelKey: 'journaling.moodSteady' },
  { value: 'heavy', labelKey: 'journaling.moodHeavy' },
] as const;

const AREA_OPTIONS = [
  'salud',
  'trabajo',
  'relaciones',
  'hogar',
  'descanso',
  'crecimiento',
] as const;

export function JournalingPage() {
  const { t } = useI18n();
  const journalEntries = useAppStore((state) => state.journalEntries);
  const addJournalEntry = useAppStore((state) => state.addJournalEntry);
  const updateJournalEntry = useAppStore((state) => state.updateJournalEntry);
  const deleteJournalEntry = useAppStore((state) => state.deleteJournalEntry);
  const journalingContextDate = useAppStore((state) => state.journalingContextDate);
  const setJournalingContextDate = useAppStore((state) => state.setJournalingContextDate);
  const [selectedDate, setSelectedDate] = useState(journalingContextDate);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('clear');
  const [tags, setTags] = useState('');
  const [linkedDate, setLinkedDate] = useState(journalingContextDate);
  const [linkedArea, setLinkedArea] = useState('');

  const filteredEntries = useMemo(() => {
    if (!selectedDate) return journalEntries;
    return journalEntries.filter((entry) => entry.createdAt.startsWith(selectedDate));
  }, [journalEntries, selectedDate]);

  const resetForm = () => {
    setEditingEntryId(null);
    setTitle('');
    setContent('');
    setMood('clear');
    setTags('');
    setLinkedDate(journalingContextDate);
    setLinkedArea('');
  };

  const handleSubmitEntry = () => {
    if (!content.trim()) return;

    const payload = {
      title: title.trim(),
      content: content.trim(),
      mood,
      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      linkedDate: linkedDate || undefined,
      linkedArea: linkedArea || undefined,
    };

    if (editingEntryId) {
      updateJournalEntry(editingEntryId, payload);
      toast.success(t('journaling.updated'));
    } else {
      addJournalEntry(payload);
      toast.success(t('journaling.created'));
    }

    resetForm();
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setEditingEntryId(entry.id);
    setTitle(entry.title);
    setContent(entry.content);
    setMood(entry.mood);
    setTags(entry.tags.join(', '));
    setLinkedDate(entry.linkedDate ?? entry.createdAt.split('T')[0] ?? journalingContextDate);
    setLinkedArea(entry.linkedArea ?? '');
  };

  const handleDeleteEntry = (id: string) => {
    deleteJournalEntry(id);
    if (editingEntryId === id) {
      resetForm();
    }
    toast.success(t('journaling.deleted'));
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/30">
            {t('journaling.eyebrow')}
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-white">{t('journaling.title')}</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/45">{t('journaling.subtitle')}</p>
        </div>
        <div className="rounded-2xl bg-violet-500/15 p-4 text-violet-300">
          <BookOpenText size={24} />
        </div>
      </section>

      <JournalFilterBar
        selectedDate={selectedDate}
        onDateChange={(value) => {
          setSelectedDate(value);
          setJournalingContextDate(value);
        }}
        label={t('journaling.filterTitle')}
        helper={t('journaling.filterSubtitle')}
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <JournalEntryComposer
            title={title}
            content={content}
            onTitleChange={setTitle}
            onContentChange={setContent}
            onSubmit={handleSubmitEntry}
            titleLabel={t('journaling.entryTitle')}
            titlePlaceholder={t('journaling.entryTitlePlaceholder')}
            contentLabel={t('journaling.entryContent')}
            contentPlaceholder={t('journaling.entryContentPlaceholder')}
            actionLabel={editingEntryId ? t('journaling.saveEntry') : t('journaling.createEntry')}
            helper={t('journaling.createHelper')}
            modeLabel={editingEntryId ? t('journaling.editHelper') : undefined}
          />

          <section className="grid gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20 md:grid-cols-2">
            <Select
              label={t('journaling.entryMood')}
              value={mood}
              onChange={(event) => setMood(event.target.value)}
              options={MOOD_OPTIONS.map((option) => ({
                value: option.value,
                label: t(option.labelKey),
              }))}
            />
            <Input
              label={t('journaling.linkedDate')}
              type="date"
              value={linkedDate}
              onChange={(event) => setLinkedDate(event.target.value)}
            />
            <Select
              label={t('journaling.linkedArea')}
              value={linkedArea}
              onChange={(event) => setLinkedArea(event.target.value)}
              options={[
                { value: '', label: t('journaling.linkedAreaPlaceholder') },
                ...AREA_OPTIONS.map((area) => ({
                  value: area,
                  label: t(`journaling.area.${area}`),
                })),
              ]}
            />
            <Input
              label={t('journaling.entryTags')}
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              placeholder={t('journaling.entryTagsPlaceholder')}
            />
          </section>
        </div>

        <JournalEntryList
          entries={filteredEntries}
          emptyMessage={t('journaling.emptyFiltered')}
          onEdit={handleEditEntry}
          onDelete={handleDeleteEntry}
        />
      </div>
    </div>
  );
}
