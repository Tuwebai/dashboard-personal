import { useCallback, useEffect, useState } from 'react';
import { List, Plus } from 'lucide-react';
import { NoteSidebar } from '../components/NoteSidebar';
import { NoteEditor } from '../components/NoteEditor';
import { NoteToolbar } from '../components/NoteToolbar';
import { useAppStore } from '../../../stores/useAppStore';
import { useI18n } from '../../../shared/i18n/useI18n';
import { Button } from '../../../shared/ui/Button';
import { useReadonlyActionProps } from '../../../shared/hooks/useReadonlyActionProps';
import { SHORTCUT_CREATE_NEW_NOTE_EVENT, useShortcutAction } from '../../../core/navigation/shortcutActions';

export type NoteFilter = 'all' | 'favorites' | 'trash' | 'folder';

export default function Notes() {
  const selectedNoteId = useAppStore((state) => state.selectedNoteId);
  const setSelectedNote = useAppStore((state) => state.setSelectedNote);
  const addNote = useAppStore((state) => state.addNote);
  const { t } = useI18n();
  const { actionProps } = useReadonlyActionProps();
  const [activeFilter, setActiveFilter] = useState<NoteFilter>('all');
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [mobileView, setMobileView] = useState<'list' | 'editor'>('list');

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileView('list');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile && selectedNoteId) {
      const frame = window.requestAnimationFrame(() => {
        setMobileView('editor');
      });

      return () => window.cancelAnimationFrame(frame);
    }
  }, [isMobile, selectedNoteId]);

  const handleFilterChange = (filter: NoteFilter, folderId: string | null = null) => {
    setActiveFilter(filter);
    setActiveFolderId(folderId);
  };

  const handleBackToList = () => {
    setSelectedNote(null);
    setMobileView('list');
  };

  const handleCreateNote = useCallback(() => {
    addNote({
      title: t('notes.newUntitled'),
      content: '',
      tags: [],
      isPinned: false,
      isFavorite: false,
      isArchived: false,
      wordCount: 0,
      readingTime: 0,
    });

    if (isMobile) {
      setMobileView('editor');
    }
  }, [addNote, isMobile, t]);

  useShortcutAction(SHORTCUT_CREATE_NEW_NOTE_EVENT, handleCreateNote);

  const showSidebar = !isMobile || mobileView === 'list';
  const showEditor = !isMobile || mobileView === 'editor';

  return (
    <div className="flex h-[calc(100vh-140px)] flex-col gap-4 pb-6 text-scrollbar page-enter md:flex-row md:gap-6">
      <div className={`${showSidebar ? 'flex' : 'hidden'} h-full w-full min-w-0 flex-col md:flex md:w-80`}>
        <NoteSidebar 
          activeFilter={activeFilter} 
          activeFolderId={activeFolderId} 
          onFilterChange={handleFilterChange} 
          onNoteSelect={() => {
            if (isMobile) {
              setMobileView('editor');
            }
          }}
        />
      </div>

      <div className={`${showEditor ? 'flex' : 'hidden'} min-w-0 flex-1 flex-col overflow-hidden rounded-3xl border border-border bg-bg-secondary glass md:flex`}>
        {selectedNoteId ? (
          <>
            <NoteToolbar showBackButton={isMobile} onBack={handleBackToList} />
            <div className="flex-1 overflow-y-auto p-5 md:p-12">
              <NoteEditor />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 shadow-xl">
              <span className="text-4xl text-text-muted opacity-30">✍️</span>
            </div>
            <h3 className="text-xl font-bold text-text-primary">{t('notes.selectNote')}</h3>
            <p className="text-text-secondary mt-2 max-w-xs">{t('notes.selectNoteDesc')}</p>
            <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                variant="secondary"
                className="w-full sm:w-auto"
                leftIcon={<List size={16} />}
                onClick={handleBackToList}
              >
                {t('notes.goToNotes')}
              </Button>
              <Button
                variant="primary"
                className="w-full sm:w-auto"
                leftIcon={<Plus size={16} />}
                {...actionProps}
                onClick={handleCreateNote}
              >
                {t('notes.createFirst')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
