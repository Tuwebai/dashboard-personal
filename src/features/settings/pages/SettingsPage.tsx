import { useState } from 'react';
import { 
  User, Palette, Bell, Tag,
  Database, Keyboard, Globe, Info,
  type LucideIcon
} from 'lucide-react';
import { cn } from '../../../shared/lib/cn';
import { useI18n } from '../../../shared/i18n/useI18n';
import { GeneralSection } from '../sections/GeneralSection';
import { AppearanceSection } from '../sections/AppearanceSection';
import { NotificationSection } from '../sections/NotificationSection';
import { SystemSection } from '../sections/SystemSection';
import { ShortcutsSection } from '../sections/ShortcutsSection';
import { LanguageSection } from '../sections/LanguageSection';
import { AboutSection } from '../sections/AboutSection';
import { TagsSection } from '../sections/TagsSection';

interface Section {
  id: 'general' | 'appearance' | 'notifications' | 'system' | 'tags' | 'shortcuts' | 'language' | 'about';
  labelKey: string;
  icon: LucideIcon;
  descKey: string;
}

const SECTIONS: Section[] = [
  { id: 'general', labelKey: 'settings.general', icon: User, descKey: 'settings.generalDesc' },
  { id: 'appearance', labelKey: 'settings.appearance', icon: Palette, descKey: 'settings.appearanceDesc' },
  { id: 'notifications', labelKey: 'settings.notifications', icon: Bell, descKey: 'settings.notificationsDesc' },
  { id: 'system', labelKey: 'settings.system', icon: Database, descKey: 'settings.systemDesc' },
  { id: 'tags', labelKey: 'settings.tags', icon: Tag, descKey: 'settings.tagsDesc' },
  { id: 'shortcuts', labelKey: 'settings.shortcuts', icon: Keyboard, descKey: 'settings.shortcutsDesc' },
  { id: 'language', labelKey: 'settings.language', icon: Globe, descKey: 'settings.languageDesc' },
  { id: 'about', labelKey: 'settings.about', icon: Info, descKey: 'settings.aboutDesc' },
];

export type SettingsSection = Section['id'];

export function Settings() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');
  const { t } = useI18n();

  const renderSection = () => {
    switch (activeSection) {
      case 'general': return <GeneralSection />;
      case 'appearance': return <AppearanceSection />;
      case 'notifications': return <NotificationSection />;
      case 'system': return <SystemSection />;
      case 'tags': return <TagsSection />;
      case 'shortcuts': return <ShortcutsSection />;
      case 'language': return <LanguageSection />;
      case 'about': return <AboutSection />;
      default: return <GeneralSection />;
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6 md:space-y-8 page-enter">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">{t('settings.title')}</h1>
        <p className="text-sm font-medium text-white/40 mt-1">{t('settings.subtitle')}</p>
      </div>

      <div className="flex-1 flex min-h-0 flex-col gap-4 md:gap-10 lg:flex-row">
        {/* Settings Sidebar */}
        <aside className="-mx-4 overflow-x-auto px-4 pb-2 md:mx-0 md:w-80 md:shrink-0 md:overflow-visible md:px-0 md:pb-0">
          <div className="flex gap-2 md:block md:space-y-2">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "flex min-w-[220px] items-center gap-3 rounded-xl p-3 text-left transition-all duration-200 group md:w-full md:min-w-0",
                activeSection === section.id 
                  ? "bg-white/10 text-white" 
                  : "text-white/40 hover:bg-white/5 hover:text-white/70"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200",
                activeSection === section.id ? "bg-white/10 text-white" : "bg-transparent text-white/40 group-hover:bg-white/5"
              )}>
                <section.icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm tracking-tight capitalize">{t(section.labelKey)}</p>
                <p className="text-[11px] text-white/40">{t(section.descKey)}</p>
              </div>
            </button>
          ))}
          </div>
        </aside>

        {/* Settings Content */}
        <main className="flex-1 overflow-y-auto no-scrollbar pb-20">
          <div className="max-w-3xl space-y-8 md:space-y-12">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
}
