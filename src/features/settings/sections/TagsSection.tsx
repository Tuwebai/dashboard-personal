import { useState } from 'react';
import { Pencil, Plus, Tag, Trash2 } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '../../../stores/useAppStore';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { useI18n } from '../../../shared/i18n/useI18n';

const TAG_COLORS = ['#7c3aed', '#06b6d4', '#22c55e', '#f59e0b', '#ef4444', '#ec4899'] as const;

export function TagsSection() {
  const { t } = useI18n();
  const { tags, addTag, updateTag, deleteTag } = useAppStore(
    useShallow((state) => ({
      tags: state.tags,
      addTag: state.addTag,
      updateTag: state.updateTag,
      deleteTag: state.deleteTag,
    }))
  );
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState<(typeof TAG_COLORS)[number]>('#7c3aed');
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingColor, setEditingColor] = useState<(typeof TAG_COLORS)[number]>('#7c3aed');

  const handleCreateTag = () => {
    if (!newTagName.trim()) return;
    addTag({ name: newTagName.trim(), color: newTagColor });
    setNewTagName('');
    setNewTagColor('#7c3aed');
  };

  const startEditing = (tagId: string, name: string, color: string) => {
    setEditingTagId(tagId);
    setEditingName(name);
    setEditingColor((TAG_COLORS.find((item) => item === color) ?? '#7c3aed') as (typeof TAG_COLORS)[number]);
  };

  const handleSaveTag = () => {
    if (!editingTagId || !editingName.trim()) return;
    updateTag(editingTagId, { name: editingName.trim(), color: editingColor });
    setEditingTagId(null);
    setEditingName('');
  };

  return (
    <section className="space-y-8">
      <div className="rounded-xl border border-border bg-bg-card p-4 sm:p-6">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-violet-400" />
          <h3 className="text-sm font-semibold tracking-tight text-white">{t('settings.tags')}</h3>
        </div>
        <p className="mt-2 text-xs text-white/40">{t('settings.tagsDesc')}</p>

        <div className="mt-6 grid gap-4 rounded-xl border border-border bg-bg-tertiary p-4">
          <Input
            label={t('settings.tagName')}
            value={newTagName}
            onChange={(event) => setNewTagName(event.target.value)}
            placeholder={t('settings.tagNamePlaceholder')}
          />
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">{t('settings.tagColor')}</p>
            <div className="flex flex-wrap gap-2">
              {TAG_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewTagColor(color)}
                  className={`h-8 w-8 rounded-full border-2 ${newTagColor === color ? 'scale-110 border-white' : 'border-white/10'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <Button variant="primary" className="w-full sm:w-auto" leftIcon={<Plus size={16} />} onClick={handleCreateTag}>
            {t('settings.createTag')}
          </Button>
        </div>

        <div className="mt-6 space-y-3">
          {tags.length > 0 ? (
            tags.map((tag) => {
              const isEditing = editingTagId === tag.id;
              return (
                <div key={tag.id} className="rounded-xl border border-border bg-bg-tertiary p-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <Input
                        label={t('settings.tagName')}
                        value={editingName}
                        onChange={(event) => setEditingName(event.target.value)}
                      />
                      <div className="flex flex-wrap gap-2">
                        {TAG_COLORS.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setEditingColor(color)}
                            className={`h-8 w-8 rounded-full border-2 ${editingColor === color ? 'scale-110 border-white' : 'border-white/10'}`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="primary" onClick={handleSaveTag}>{t('common.saveChanges')}</Button>
                        <Button variant="ghost" onClick={() => setEditingTagId(null)}>{t('common.cancel')}</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: tag.color }} />
                        <span className="text-sm font-medium text-white">{tag.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => startEditing(tag.id, tag.name, tag.color)} className="text-white/45 hover:text-white">
                          <Pencil size={16} />
                        </button>
                        <button type="button" onClick={() => deleteTag(tag.id)} className="text-rose-300 hover:text-rose-200">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-bg-tertiary p-4 text-sm text-white/45">
              {t('settings.noTags')}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
