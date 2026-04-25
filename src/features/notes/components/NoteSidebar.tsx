import { Search, Plus, Folder, Star, Trash2 } from 'lucide-react';
import { useAppStore } from '../../../stores/useAppStore';
import { cn } from '../../../shared/lib/cn';
import { format } from 'date-fns';
import { useI18n } from '../../../shared/i18n/useI18n';
import type { NoteFilter } from '../pages/NotesPage';
import { useShallow } from 'zustand/react/shallow';

interface NoteSidebarProps {
  activeFilter: NoteFilter;
  activeFolderId: string | null;
  onFilterChange: (filter: NoteFilter, folderId?: string | null) => void;
}

export function NoteSidebar({ activeFilter, activeFolderId, onFilterChange }: NoteSidebarProps) {
  const { notes, selectedNoteId, setSelectedNote, noteSearch, setNoteSearch, addNote, folders } = useAppStore(
    useShallow((state) => ({
      notes: state.notes,
      selectedNoteId: state.selectedNoteId,
      setSelectedNote: state.setSelectedNote,
      noteSearch: state.noteSearch,
      setNoteSearch: state.setNoteSearch,
      addNote: state.addNote,
      folders: state.folders,
    })),
  );
  const { t } = useI18n();

  const filteredNotes = notes.filter(note => {
    // Text search filter
    const matchesSearch = note.title.toLowerCase().includes(noteSearch.toLowerCase()) ||
                         note.content.toLowerCase().includes(noteSearch.toLowerCase());
    if (!matchesSearch) return false;

    // View filter
    if (activeFilter === 'favorites') return note.isFavorite && !note.isArchived;
    if (activeFilter === 'trash') return note.isArchived;
    if (activeFilter === 'folder') return note.folderId === activeFolderId && !note.isArchived;
    
    // Default: 'all' notes (not archived)
    return !note.isArchived;
  });

  const handleCreateNote = () => {
    addNote({
      title: 'New Note',
      content: '',
      tags: [],
      isPinned: false,
      isFavorite: activeFilter === 'favorites',
      isArchived: false,
      folderId: activeFilter === 'folder' ? activeFolderId || undefined : undefined,
      wordCount: 0,
      readingTime: 0
    });
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text"
            placeholder={t('notes.searchPlaceholder')}
            value={noteSearch}
            onChange={(e) => setNoteSearch(e.target.value)}
            className="w-full bg-bg-secondary border border-border rounded-xl pl-10 pr-4 py-2 text-sm text-text-primary placeholder:text-text-muted focus:ring-1 focus:ring-violet-500/50 outline-none transition-all"
          />
        </div>
        <button 
          onClick={handleCreateNote}
          className="p-2 bg-violet-500 text-white rounded-xl shadow-lg shadow-violet-500/20 hover:bg-violet-600 transition-all active:scale-95"
          title={t('notes.new')}
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pr-1 scrollbar-thin">
        <div className="space-y-1">
          <button 
            onClick={() => onFilterChange('all')}
            className={cn(
              "w-full flex items-center justify-between p-2 rounded-xl transition-all",
              activeFilter === 'all' ? "bg-white/10 text-text-primary font-bold" : "text-text-muted hover:text-text-primary"
            )}
          >
            <div className="flex items-center gap-2">
              <Folder size={14} className="text-violet-400" />
              <span className="text-xs">{t('notes.allNotes')}</span>
            </div>
            <span className="text-[10px] opacity-50">{notes.filter(n => !n.isArchived).length}</span>
          </button>
          
          <button 
            onClick={() => onFilterChange('favorites')}
            className={cn(
              "w-full flex items-center justify-between p-2 rounded-xl transition-all",
              activeFilter === 'favorites' ? "bg-white/10 text-text-primary font-bold" : "text-text-muted hover:text-text-primary"
            )}
          >
            <div className="flex items-center gap-2">
              <Star size={14} className="text-amber-400" />
              <span className="text-xs">{t('notes.favorites')}</span>
            </div>
            <span className="text-[10px] opacity-50">{notes.filter(n => n.isFavorite && !n.isArchived).length}</span>
          </button>

          <button 
            onClick={() => onFilterChange('trash')}
            className={cn(
              "w-full flex items-center justify-between p-2 rounded-xl transition-all",
              activeFilter === 'trash' ? "bg-white/10 text-text-primary font-bold" : "text-text-muted hover:text-text-primary"
            )}
          >
            <div className="flex items-center gap-2">
              <Trash2 size={14} className="text-rose-400" />
              <span className="text-xs">{t('notes.trash')}</span>
            </div>
            <span className="text-[10px] opacity-50">{notes.filter(n => n.isArchived).length}</span>
          </button>
        </div>

        {folders.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-[9px] font-bold text-text-muted uppercase tracking-widest px-2">{t('notes.folders')}</h4>
            <div className="space-y-1">
              {folders.map(folder => (
                <button
                  key={folder.id}
                  onClick={() => onFilterChange('folder', folder.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-2 rounded-xl transition-all",
                    activeFilter === 'folder' && activeFolderId === folder.id ? "bg-white/10 text-text-primary font-bold" : "text-text-muted hover:text-text-primary"
                  )}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-xs"># {folder.name}</span>
                  </div>
                  <span className="text-[10px] opacity-50">{notes.filter(n => n.folderId === folder.id && !n.isArchived).length}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4 pt-2">
          <h4 className="text-[9px] font-bold text-text-muted uppercase tracking-widest px-2">{t('notes.recent')}</h4>
          <div className="space-y-2">
            {filteredNotes.length > 0 ? (
              filteredNotes.map(note => (
                <button
                  key={note.id}
                  onClick={() => setSelectedNote(note.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-2xl border transition-all group relative overflow-hidden",
                    selectedNoteId === note.id 
                      ? "bg-violet-500/10 border-violet-500/30 ring-1 ring-violet-500/20" 
                      : "bg-bg-secondary border-border hover:bg-bg-hover"
                  )}
                >
                  <h5 className={cn(
                    "font-bold text-sm truncate mb-1 transition-colors relative z-10",
                    selectedNoteId === note.id ? "text-violet-400" : "text-text-primary group-hover:text-violet-400"
                  )}>
                    {note.title || t('notes.untitled')}
                  </h5>
                  <div 
                    className="text-[11px] text-text-secondary line-clamp-2 mb-3 leading-relaxed opacity-60 relative z-10 [&_h1]:text-xs [&_h1]:inline [&_h2]:text-xs [&_h2]:inline [&_p]:inline [&_ul]:inline [&_li]:inline [&_br]:hidden"
                    dangerouslySetInnerHTML={{ 
                      __html: note.content 
                        ? note.content.replace(/&nbsp;/g, ' ') 
                        : t('notes.noContent') 
                    }}
                  />
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-[9px] font-bold text-text-muted font-mono">
                      {format(new Date(note.updatedAt), 'MMM d, yyyy')}
                    </span>
                    <div className="flex gap-1">
                      {note.tags.map(tag => (
                        <span key={tag} className="text-[8px] bg-white/5 px-1.5 py-0.5 rounded-md text-text-muted border border-border/50">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="py-8 text-center text-text-muted italic text-xs">{t('notes.noNotes')}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
