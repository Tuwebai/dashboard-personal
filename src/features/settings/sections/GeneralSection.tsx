import { Input, Textarea } from '../../../shared/ui/Input';
import { Button } from '../../../shared/ui/Button';
import { Camera, Mail, User as UserIcon, MapPin, Globe, Check } from 'lucide-react';
import { useProfileSettings } from '../hooks/useProfileSettings';
import { useI18n } from '../../../shared/i18n/useI18n';

export function GeneralSection() {
  const { t } = useI18n();
  const {
    user, profileData, isSaving, saved, fileInputRef, 
    handleFieldChange, saveProfile, handleAvatarClick, handleAvatarFileChange 
  } = useProfileSettings();

  return (
    <section className="space-y-8 md:space-y-12">
      <div className="flex flex-col items-center gap-6 rounded-xl border border-border bg-bg-card p-4 sm:p-6 md:flex-row md:items-start md:gap-8">
        <div className="relative group shrink-0">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleAvatarFileChange} 
            className="hidden" 
            accept="image/*" 
          />
          <div 
            className="flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-2xl font-bold text-white/90 shadow-md sm:h-24 sm:w-24 sm:text-3xl"
            onClick={handleAvatarClick}
          >
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              profileData.name.charAt(0).toUpperCase()
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
              <Camera size={28} className="text-white transform scale-90 group-hover:scale-100 transition-transform" />
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center text-white shadow-md ring-4 ring-[#161616] pointer-events-none">
            <Camera size={14} />
          </div>
        </div>

        <div className="w-full flex-1 space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
            <Input 
              label={t('settings.displayName')} 
              value={profileData.name} 
              onChange={(e) => handleFieldChange('name', e.target.value)}
              leftIcon={<UserIcon size={18} />}
            />
            <Input 
              label={t('settings.emailAddress')} 
              value={profileData.email} 
              onChange={(e) => handleFieldChange('email', e.target.value)}
              leftIcon={<Mail size={18} />}
            />
          </div>
          <Textarea 
            label={t('settings.bioVisible')} 
            placeholder={t('settings.bioPlaceholder')}
            className="h-32"
            value={profileData.bio}
            onChange={(e) => handleFieldChange('bio', e.target.value)}
          />
          <div className="flex justify-stretch pt-2 md:justify-end md:pt-4">
            <Button 
              variant="primary" 
              className="h-10 w-full min-w-[140px] px-6 font-bold shadow-md md:w-auto md:px-8"
              onClick={saveProfile}
              loading={isSaving}
              leftIcon={saved ? <Check size={18} /> : undefined}
            >
              {saved ? 'Saved!' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:gap-8">
        <div className="rounded-xl border border-border bg-bg-card p-4 space-y-6 sm:p-6">
          <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
            <Globe className="w-4 h-4 text-violet-400" />
            Localization
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
            <Input 
              label={t('settings.timezone')} 
              value={profileData.timezone} 
              onChange={(e) => handleFieldChange('timezone', e.target.value)}
              leftIcon={<Globe size={18} />} 
            />
            <Input 
              label={t('settings.region')} 
              defaultValue="International (Metric)" 
              disabled
              leftIcon={<MapPin size={18} />} 
              className="opacity-50 cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
