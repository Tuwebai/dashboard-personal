import { SlideOver } from '../../../shared/ui/Modal';
import { Button } from '../../../shared/ui/Button';
import { CalendarEvent } from '../../../shared/types';
import { useAppStore } from '../../../stores/useAppStore';
import { useI18n } from '../../../shared/i18n/useI18n';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { Trash2, Clock, MapPin, Edit3, Type } from 'lucide-react';

interface EventDetailModalProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EventDetailModal({ event, isOpen, onClose }: EventDetailModalProps) {
  const { deleteEvent } = useAppStore();
  const { t, lang } = useI18n();

  if (!event) return null;

  const handleDelete = () => {
    deleteEvent(event.id);
    toast.success(t('calendar.eventDeleted'));
    onClose();
  };

  return (
    <SlideOver isOpen={isOpen} onClose={onClose} title={t('calendar.details')} width="w-96">
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
             <div className="w-4 h-4 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: event.color }} />
             <h2 className="text-2xl font-bold text-text-primary leading-tight">{event.title}</h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-0.5 rounded-md bg-white/5 border border-border text-[10px] text-text-muted font-bold uppercase tracking-wider">
              #{event.category}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-white/5 rounded-lg text-violet-400">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary">
                {format(new Date(event.startDate), 'EEEE, MMMM d', { locale: lang === 'es' ? es : enUS })}
              </p>
              <p className="text-xs text-text-muted mt-0.5">
                {format(new Date(event.startDate), 'h:mm a', { locale: lang === 'es' ? es : enUS })} - {format(new Date(event.endDate), 'h:mm a', { locale: lang === 'es' ? es : enUS })}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2 bg-white/5 rounded-lg text-violet-400">
              <MapPin size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary">{event.location || t('calendar.noLocation')}</p>
              <p className="text-xs text-text-muted mt-0.5">{t('calendar.noLocationDesc')}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2 bg-white/5 rounded-lg text-violet-400">
              <Type size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary">{event.description || t('calendar.noDescription')}</p>
              <p className="text-xs text-text-muted mt-0.5">{t('calendar.noDescriptionDesc')}</p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col gap-3">
          <Button 
            variant="primary" 
            className="w-full h-11" 
            leftIcon={<Edit3 size={16} />}
            onClick={() => {}}
          >
            {t('calendar.edit')}
          </Button>
          <Button 
            variant="ghost" 
            className="w-full h-11 text-rose-400 hover:bg-rose-500/10" 
            leftIcon={<Trash2 size={16} />}
            onClick={handleDelete}
          >
            {t('calendar.delete')}
          </Button>
        </div>
      </div>
    </SlideOver>
  );
}
