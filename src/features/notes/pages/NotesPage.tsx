import { useState } from 'react';
import { NoteSidebar } from '../components/NoteSidebar';
import { NoteEditor } from '../components/NoteEditor';
import { NoteToolbar } from '../components/NoteToolbar';
import { useAppStore } from '../../../stores/useAppStore';
import { useI18n } from '../../../shared/i18n/useI18n';

export type NoteFilter = 'all' | 'favorites' | 'trash' | 'folder';

export default function Notes() {
  const selectedNoteId = useAppStore((state) => state.selectedNoteId);
  const { t } = useI18n();
  const [activeFilter, setActiveFilter] = useState<NoteFilter>('all');
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);

  const handleFilterChange = (filter: NoteFilter, folderId: string | null = null) => {
    setActiveFilter(filter);
    setActiveFolderId(folderId);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex gap-6 page-enter pb-6 text-scrollbar">
      {/* Sidebar - Note List */}
      <div className="w-80 h-full flex flex-col min-w-0">
        <NoteSidebar 
          activeFilter={activeFilter} 
          activeFolderId={activeFolderId} 
          onFilterChange={handleFilterChange} 
        />
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col bg-bg-secondary border border-border rounded-3xl glass overflow-hidden min-w-0">
        {selectedNoteId ? (
          <>
            <NoteToolbar />
            <div className="flex-1 overflow-y-auto p-8 md:p-12">
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
