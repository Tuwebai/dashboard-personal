import { Button } from './Button';
import { Modal } from './Modal';
import { useI18n } from '../i18n/useI18n';

interface ConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: 'danger' | 'warning';
}

export function ConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmLabel,
  variant = 'danger',
}: ConfirmDialogProps) {
  const { t } = useI18n();

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} size="sm">
      <div className="space-y-5 pt-2">
        <p className="text-sm leading-6 text-white/65">{message}</p>
        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
          <Button
            variant="primary"
            className={variant === 'danger' ? 'flex-1 bg-red-500 hover:bg-red-600' : 'flex-1'}
            onClick={onConfirm}
          >
            {confirmLabel ?? t('common.confirm')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
