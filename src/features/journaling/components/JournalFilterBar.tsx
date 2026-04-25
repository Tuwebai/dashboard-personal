interface JournalFilterBarProps {
  selectedDate: string;
  onDateChange: (value: string) => void;
  label: string;
  helper: string;
}

export function JournalFilterBar({
  selectedDate,
  onDateChange,
  label,
  helper,
}: JournalFilterBarProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white">{label}</h2>
          <p className="mt-1 text-xs text-white/35">{helper}</p>
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(event) => onDateChange(event.target.value)}
          className="h-11 rounded-2xl border border-white/5 bg-white/[0.03] px-4 text-sm text-white/90 outline-none transition-all duration-300 focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10"
        />
      </div>
    </section>
  );
}
