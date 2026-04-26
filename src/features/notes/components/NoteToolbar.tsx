import { ArrowLeft, Star, Share2, MoreHorizontal, Archive, Trash2, Pin } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '../../../stores/useAppStore';
import { cn } from '../../../shared/lib/cn';
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n';
import { motion, AnimatePresence } from 'framer-motion';
import { ConfirmDialog } from '../../../shared/ui/ConfirmDialog';
import { useShallow } from 'zustand/react/shallow';
import { useReadonlyActionProps } from '../../../shared/hooks/useReadonlyActionProps';

interface NoteToolbarProps {
  showBackButton?: boolean;
  onBack?: () => void;
}

export function NoteToolbar({ showBackButton = false, onBack }: NoteToolbarProps) {
  const { t } = useI18n();
  const { workspaceReadOnly, readonlyActionLabel, actionProps } = useReadonlyActionProps();
  const { notes, selectedNoteId, updateNote, deleteNote } = useAppStore(
    useShallow((state) => ({
      notes: state.notes,
      selectedNoteId: state.selectedNoteId,
      updateNote: state.updateNote,
      deleteNote: state.deleteNote,
    })),
  );
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const note = notes.find(n => n.id === selectedNoteId);

  if (!note) return null;

  const handleToggleFavorite = () => {
    updateNote(note.id, { isFavorite: !note.isFavorite });
  };

  const handleTogglePinned = () => {
    updateNote(note.id, { isPinned: !note.isPinned });
  };

  const handleArchive = () => {
    updateNote(note.id, { isArchived: !note.isArchived });
    setShowMenu(false);
    toast.success(t(note.isArchived ? 'notes.noteRestored' : 'notes.noteArchived'));
  };

  const handleDelete = () => {
    setShowMenu(false);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    deleteNote(note.id);
    setIsDeleteOpen(false);
    toast.success(t('notes.noteDeleted'));
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success(t('notes.linkCopied'));
    } catch {
      toast.error(t('notes.shareFailed'));
    }
  };

  return (
    <>
      <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-white/2 relative">
        <div className="flex min-w-0 items-center gap-1">
        {showBackButton && onBack && (
          <button
            onClick={onBack}
            className="mr-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-text-muted transition-all hover:bg-white/5 hover:text-text-primary"
            title={t('notes.backToNotes')}
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <input
          data-testid="note-title-input"
          type="text"
          value={note.title}
          readOnly={workspaceReadOnly}
          onChange={(e) => updateNote(note.id, { title: e.target.value })}
          className="w-full bg-transparent border-none text-lg font-bold text-text-primary focus:ring-0 placeholder:text-text-muted md:max-w-96"
          placeholder={t('common.untitledNote')}
          title={workspaceReadOnly ? readonlyActionLabel : undefined}
        />
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={handleTogglePinned}
          type="button"
          {...actionProps}
          className={cn(
            "p-2 rounded-xl transition-all disabled:cursor-not-allowed disabled:opacity-50",
            note.isPinned ? "bg-violet-500/10 text-violet-400" : "text-text-muted hover:text-text-primary hover:bg-white/5"
          )}
          title={workspaceReadOnly ? readonlyActionLabel : t('common.pin')}
        >
          <Pin size={18} className={note.isPinned ? "fill-current" : ""} />
        </button>

        <button 
          onClick={handleToggleFavorite}
          type="button"
          {...actionProps}
          className={cn(
            "p-2 rounded-xl transition-all disabled:cursor-not-allowed disabled:opacity-50",
            note.isFavorite ? "bg-amber-500/10 text-amber-500" : "text-text-muted hover:text-text-primary hover:bg-white/5"
          )}
          title={workspaceReadOnly ? readonlyActionLabel : t('common.favorite')}
        >
          <Star size={18} className={note.isFavorite ? "fill-current" : ""} />
        </button>

        <div className="h-6 w-[1px] bg-border mx-1" />

        <button 
          onClick={handleShare}
          className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-white/5 transition-all"
          title={t('common.share')}
        >
          <Share2 size={18} />
        </button>

        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            type="button"
            {...actionProps}
            className={cn(
              "p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-white/5 transition-all disabled:cursor-not-allowed disabled:opacity-50",
              showMenu && "bg-white/10 text-text-primary"
            )}
            title={workspaceReadOnly ? readonlyActionLabel : t('common.more')}
          >
            <MoreHorizontal size={18} />
          </button>

          <AnimatePresence>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-bg-secondary border border-border rounded-2xl shadow-2xl p-2 z-50 glass"
                >
                  <button
                    onClick={handleArchive}
                    type="button"
                    {...actionProps}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all text-left disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Archive size={16} />
                    <span>{note.isArchived ? t('notes.restore') : t('notes.archive')}</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    type="button"
                    {...actionProps}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10 transition-all text-left disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                    <span>{t('notes.deleteAction')}</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
        </div>
      </div>
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title={t('notes.deleteTitle')}
        message={t('notes.deleteMessage')}
      />
    </>
  );
}
