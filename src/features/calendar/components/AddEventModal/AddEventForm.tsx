import { useState, memo } from 'react';
import { useI18n } from '../../../../shared/i18n/useI18n';
import { Button } from '../../../../shared/ui/Button';
import { Select } from '../../../../shared/ui/Input';
import { cn } from '../../../../shared/lib/cn';
import {
  createDefaultCalendarEventFormValues,
  type CalendarEventFormValues,
} from '../../lib/eventForm';

interface EventFormProps {
  initialValues?: CalendarEventFormValues;
  submitLabel: string;
  onConfirm: (event: CalendarEventFormValues) => void;
}

export const AddEventForm = memo(({ initialValues, submitLabel, onConfirm }: EventFormProps) => {
  const { t } = useI18n();
  const [formData, setFormData] = useState<CalendarEventFormValues>(
    initialValues ?? createDefaultCalendarEventFormValues(),
  );

  const handleSubmit = () => {
    const title = formData.title.trim();
    if (!title) return;

    onConfirm({ ...formData, title });
  };

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label 
          htmlFor="cal-event-title" 
          className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-1"
        >
          {t('calendar.eventTitle')}
        </label>
        <input 
          id="cal-event-title"
          name="event_title"
          type="text" 
          value={formData.title} 
          onChange={e => setFormData({...formData, title: e.target.value})} 
          className="w-full bg-bg-tertiary border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary outline-none focus:ring-1 focus:ring-violet-500/50 transition-all" 
          placeholder={t('calendar.eventPlaceholder')} 
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label 
            htmlFor="cal-event-date"
            className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-1"
          >
            {t('calendar.date')}
          </label>
          <input 
            id="cal-event-date"
            name="event_date"
            type="date" 
            value={formData.startDate} 
            onChange={e => setFormData({...formData, startDate: e.target.value})} 
            className="w-full bg-bg-tertiary border border-border rounded-xl px-3 py-2.5 text-xs text-text-primary outline-none focus:ring-1 focus:ring-violet-500/50" 
          />
        </div>
        <div className="space-y-1.5">
          <label 
            htmlFor="cal-event-time"
            className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-1"
          >
            {t('calendar.time')}
          </label>
          <input 
            id="cal-event-time"
            name="event_time"
            type="time"
            value={formData.startTime} 
            onChange={e => setFormData({...formData, startTime: e.target.value})} 
            className="w-full bg-bg-tertiary border border-border rounded-xl px-3 py-2.5 text-xs text-text-primary outline-none focus:ring-1 focus:ring-violet-500/50" 
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label 
            htmlFor="cal-event-duration"
            className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-1"
          >
            {t('calendar.duration')}
          </label>
          <Select
            id="cal-event-duration"
            name="event_duration"
            value={formData.duration}
            onChange={e => setFormData({...formData, duration: e.target.value})}
            options={[
              { value: '15', label: t('calendar.min15') },
              { value: '30', label: t('calendar.min30') },
              { value: '60', label: t('calendar.hour1') },
              { value: '120', label: t('calendar.hour2') },
            ]}
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="cal-event-reminder"
            className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-1"
          >
            {t('calendar.reminder')}
          </label>
          <Select
            id="cal-event-reminder"
            name="event_reminder"
            value={formData.reminder}
            onChange={e => setFormData({...formData, reminder: e.target.value})}
            options={[
              { value: 'none', label: t('calendar.reminderNone') },
              { value: '5', label: t('calendar.reminder5min') },
              { value: '10', label: t('calendar.reminder10min') },
              { value: '15', label: t('calendar.reminder15min') },
              { value: '30', label: t('calendar.reminder30min') },
              { value: '60', label: t('calendar.reminder60min') },
              { value: '1440', label: t('calendar.reminder1day') },
            ]}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-1">{t('calendar.labelColor')}</label>
          <div className="flex items-center gap-3 px-1 py-2">
            {COLORS.map(c => (
              <button 
                key={c} 
                type="button"
                onClick={() => setFormData({...formData, color: c})} 
                className={cn(
                  "w-6 h-6 rounded-full border-2 transition-all cursor-pointer hover:scale-110", 
                  formData.color === c ? "border-white scale-110 shadow-lg" : "border-transparent opacity-60"
                )} 
                style={{ backgroundColor: c }} 
                aria-label={`${t('calendar.selectColor')} ${c}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button variant="primary" className="w-full h-12 shadow-lg font-bold" onClick={handleSubmit}>
          {submitLabel}
        </Button>
      </div>
    </div>
  );
});

AddEventForm.displayName = 'AddEventForm';
