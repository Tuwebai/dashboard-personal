import { useRef, useEffect, useState, useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '../../../stores/useAppStore';
import { useI18n } from '../../../shared/i18n/useI18n';
import { cn } from '../../../shared/lib/cn';

export function NoteEditor() {
  const { notes, selectedNoteId, updateNote } = useAppStore(
    useShallow((state) => ({
      notes: state.notes,
      selectedNoteId: state.selectedNoteId,
      updateNote: state.updateNote,
    }))
  );
  const { t } = useI18n();
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>({});
  const note = notes.find(n => n.id === selectedNoteId);

  const checkActiveFormats = useCallback(() => {
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      h1: document.queryCommandValue('formatBlock') === 'h1',
      h2: document.queryCommandValue('formatBlock') === 'h2',
      list: document.queryCommandState('insertUnorderedList')
    });
  }, []);

  // Sync editor content only when switching notes
  useEffect(() => {
    if (editorRef.current && note) {
      if (editorRef.current.innerHTML !== note.content) {
        editorRef.current.innerHTML = note.content;
      }
      // Use timeout to avoid cascading renders (updating state synchronously in effect)
      const timer = setTimeout(() => {
        checkActiveFormats();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [selectedNoteId, note, checkActiveFormats]);

  if (!note) return null;

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const html = e.currentTarget.innerHTML;
    updateNote(note.id, { content: html });
  };

  const applyFormat = (command: string, value: string | undefined = undefined) => {
    // For block formats (H1, H2), check if they are already active to toggle them off
    if (command === 'formatBlock') {
      const currentValue = document.queryCommandValue('formatBlock').toLowerCase();
      if (currentValue === value?.toLowerCase()) {
        document.execCommand('formatBlock', false, 'p');
      } else {
        document.execCommand(command, false, value);
      }
    } else {
      document.execCommand(command, false, value);
    }
    
    // For links, collapse selection to end so typing doesn't delete the link
    if (command === 'createLink') {
      const selection = window.getSelection();
      if (selection) {
        selection.collapseToEnd();
      }
    }

    editorRef.current?.focus();
    checkActiveFormats();
    
    if (editorRef.current) {
      updateNote(note.id, { content: editorRef.current.innerHTML });
    }
  };

  return (
    <div className="w-full h-full max-w-4xl mx-auto flex flex-col">
      {/* Editor Toolbar */}
      <div className="flex items-center gap-1 mb-8 p-1 bg-white/5 rounded-xl border border-border/50 w-fit shrink-0">
        {[
          { label: 'B', cmd: 'bold', id: 'bold' },
          { label: 'I', cmd: 'italic', id: 'italic' },
          { label: 'U', cmd: 'underline', id: 'underline' },
          { label: 'H1', cmd: 'formatBlock', val: 'h1', id: 'h1' },
          { label: 'H2', cmd: 'formatBlock', val: 'h2', id: 'h2' },
          { label: 'List', cmd: 'insertUnorderedList', id: 'list' },
          { label: 'Link', cmd: 'createLink', val: 'https://' }
        ].map(btn => (
          <button 
            key={btn.label}
            onClick={() => applyFormat(btn.cmd, btn.val)}
            className={cn(
              "w-10 h-8 flex items-center justify-center text-[10px] font-bold rounded-lg transition-all cursor-pointer",
              btn.id && activeFormats[btn.id] 
                ? "bg-violet-500/20 text-violet-400 border border-violet-500/30" 
                : "text-text-muted hover:text-text-primary hover:bg-white/10 border border-transparent"
            )}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyUp={checkActiveFormats}
        onMouseUp={checkActiveFormats}
        className="flex-1 w-full bg-transparent text-text-secondary leading-relaxed outline-none placeholder:text-text-muted/30 text-lg overflow-y-auto cursor-text focus:empty:before:content-[attr(data-placeholder)] focus:empty:before:text-text-muted/30 prose prose-invert max-w-none pb-20 [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:text-text-primary [&_h1]:mb-6 [&_h1]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-text-primary [&_h2]:mb-4 [&_h2]:mt-6 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_li]:mb-1"
        data-placeholder={t('notes.placeholder')}
      />
      
      <div className="mt-8 pt-8 border-t border-border/10 flex items-center justify-between text-[10px] font-bold text-text-muted uppercase tracking-widest font-mono shrink-0">

        <div />
        <div>
          Last edited on {new Date(note.updatedAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
