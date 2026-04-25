import { useEffect, useState } from 'react';
import { NoteSidebar } from '../components/NoteSidebar';
import { NoteEditor } from '../components/NoteEditor';
import { NoteToolbar } from '../components/NoteToolbar';
import { useAppStore } from '../../../stores/useAppStore';
import { useI18n } from '../../../shared/i18n/useI18n';

export type NoteFilter = 'all' | 'favorites' | 'trash' | 'folder';

export default function Notes() {
  const selectedNoteId = useAppStore((state) => state.selectedNoteId);
  const setSelectedNote = useAppStore((state) => state.setSelectedNote);
  const { t } = useI18n();
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
          </div>
        )}
      </div>
    </div>
  );
}
