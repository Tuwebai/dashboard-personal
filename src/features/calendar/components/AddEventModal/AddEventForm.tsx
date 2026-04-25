import { useState, memo } from 'react';
import { format } from 'date-fns';
import { useI18n } from '../../../../shared/i18n/useI18n';
import { Button } from '../../../../shared/ui/Button';
import { Select } from '../../../../shared/ui/Input';
import { cn } from '../../../../shared/lib/cn';

interface EventFormProps {
  onConfirm: (event: { title: string; startDate: string; startTime: string; duration: string; color: string }) => void;
}

export const AddEventForm = memo(({ onConfirm }: EventFormProps) => {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    title: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    duration: '60',
    color: '#8b5cf6'
  });

  const handleSubmit = () => {
    if (!formData.title) return;
    onConfirm(formData);
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
            type="text" 
            placeholder="09:00" 
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
          {t('calendar.confirm')}
        </Button>
      </div>
    </div>
  );
});

AddEventForm.displayName = 'AddEventForm';
