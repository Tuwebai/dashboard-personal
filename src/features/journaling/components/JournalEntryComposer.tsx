import { Plus } from 'lucide-react';
import { Button } from '../../../shared/ui/Button';
import { Input, Textarea } from '../../../shared/ui/Input';

interface JournalEntryComposerProps {
  title: string;
  content: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onSubmit: () => void;
  titleLabel: string;
  titlePlaceholder: string;
  contentLabel: string;
  contentPlaceholder: string;
  actionLabel: string;
  helper: string;
  modeLabel?: string;
}

export function JournalEntryComposer(props: JournalEntryComposerProps) {
  const {
    title,
    content,
    onTitleChange,
    onContentChange,
    onSubmit,
    titleLabel,
    titlePlaceholder,
    contentLabel,
    contentPlaceholder,
    actionLabel,
    helper,
    modeLabel,
  } = props;

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-violet-500/15 p-3 text-violet-300">
          <Plus size={20} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">{actionLabel}</h2>
          <p className="text-xs text-white/35">{modeLabel ?? helper}</p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <Input
          label={titleLabel}
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder={titlePlaceholder}
        />
        <Textarea
          label={contentLabel}
          value={content}
          onChange={(event) => onContentChange(event.target.value)}
          placeholder={contentPlaceholder}
          className="min-h-40"
        />
        <Button onClick={onSubmit} className="w-full sm:w-auto">
          {actionLabel}
        </Button>
      </div>
    </section>
  );
}
