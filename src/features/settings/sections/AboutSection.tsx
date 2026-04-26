import { Info, Code2, Scale, Zap } from 'lucide-react';
import { useI18n } from '../../../shared/i18n/useI18n';
import { formatSettingsDate } from '../lib/locale';

const TECH_STACK = [
  'React 18', 'TypeScript', 'Zustand', 'Tailwind CSS',
  'Framer Motion', 'Recharts', 'date-fns', 'Vite',
];
const APP_VERSION = '2.4.0';
const APP_BUILD_DATE = '2026-04-16';

export function AboutSection() {
  const { t, lang } = useI18n();
  const localizedBuildDate = formatSettingsDate(new Date(`${APP_BUILD_DATE}T00:00:00`), lang);

  return (
    <section className="space-y-8">
      <div className="rounded-xl border border-border bg-bg-card p-4 space-y-6 sm:p-6">
        <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
          <Info className="w-4 h-4 text-violet-400" />
          {t('about.title')}
        </h3>

        <p className="text-xs text-white/40 leading-relaxed">{t('about.description')}</p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="p-4 bg-bg-tertiary border border-border rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={14} className="text-violet-400" />
              <span className="text-[11px] text-white/40 font-medium">{t('about.version')}</span>
            </div>
            <p className="text-sm font-semibold text-white">{APP_VERSION}</p>
          </div>
          <div className="p-4 bg-bg-tertiary border border-border rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Info size={14} className="text-violet-400" />
              <span className="text-[11px] text-white/40 font-medium">{t('about.buildDate')}</span>
            </div>
            <p className="text-sm font-semibold text-white">{localizedBuildDate}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-bg-card p-4 space-y-4 sm:p-6">
        <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
          <Code2 className="w-4 h-4 text-violet-400" />
          {t('about.techStack')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {TECH_STACK.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1.5 bg-bg-tertiary border border-border rounded-lg text-xs text-white/60 font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="p-5 bg-bg-card border border-border rounded-xl flex items-center gap-4">
        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40">
          <Scale size={20} />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{t('about.license')}</p>
          <p className="text-xs text-white/40">{t('about.licenseValue')}</p>
        </div>
      </div>
    </section>
  );
}
