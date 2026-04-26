import { useCallback, useState } from 'react';
import { Input, Textarea } from '../../../shared/ui/Input';
import { Button } from '../../../shared/ui/Button';
import { Camera, Mail, User as UserIcon, MapPin, Globe, Check, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useProfileSettings } from '../hooks/useProfileSettings';
import { useI18n } from '../../../shared/i18n/useI18n';
import { useAppStore } from '../../../stores/useAppStore';
import { mapFirebaseAuthError } from '../../auth/lib/mapFirebaseAuthError';
import { DEFAULT_NEXUS_AVATAR } from '../../../shared/lib/defaultAvatar';
import { SHORTCUT_SAVE_ACTIVE_EVENT, useShortcutAction } from '../../../core/navigation/shortcutActions';

export function GeneralSection() {
  const { t } = useI18n();
  const authProvider = useAppStore((state) => state.authProvider);
  const linkAnonymousAccount = useAppStore((state) => state.linkAnonymousAccount);
  const {
    user, profileData, isSaving, saved, fileInputRef, 
    handleFieldChange, saveProfile, handleAvatarClick, handleAvatarFileChange, profileReadonlyError,
  } = useProfileSettings();
  const [linkPassword, setLinkPassword] = useState('');
  const [confirmLinkPassword, setConfirmLinkPassword] = useState('');
  const [isLinking, setIsLinking] = useState(false);

  const handleSaveProfile = useCallback(async () => {
    try {
      await saveProfile();
      toast.success(t('settings.profileSaved'));
    } catch (error) {
      toast.error(
        error instanceof Error && error.message === profileReadonlyError
          ? t('settings.profileReadonly')
          : t('settings.profileSaveError'),
      );
    }
  }, [profileReadonlyError, saveProfile, t]);

  useShortcutAction(SHORTCUT_SAVE_ACTIVE_EVENT, () => {
    void handleSaveProfile();
  });

  const handleLinkGuestAccount = async () => {
    const normalizedEmail = profileData.email.trim();

    if (!normalizedEmail || !linkPassword) {
      toast.error(t('auth.sessionRequired'));
      return;
    }

    if (linkPassword !== confirmLinkPassword) {
      toast.error(t('auth.passwordMismatch'));
      return;
    }

    setIsLinking(true);

    try {
      await linkAnonymousAccount(normalizedEmail, linkPassword);
      toast.success(t('auth.linkedSuccess'));
      setLinkPassword('');
      setConfirmLinkPassword('');
      handleFieldChange('email', normalizedEmail);
    } catch (error) {
      toast.error(mapFirebaseAuthError(error, t));
    } finally {
      setIsLinking(false);
    }
  };

  const onAvatarFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      await handleAvatarFileChange(event);
      toast.success(t('settings.avatarUpdated'));
    } catch (error) {
      toast.error(
        error instanceof Error && error.message === profileReadonlyError
          ? t('settings.profileReadonly')
          : t('settings.avatarUpdateError'),
      );
    }
  };

  return (
    <section className="space-y-8 md:space-y-12">
      <div className="flex flex-col items-center gap-6 rounded-xl border border-border bg-bg-card p-4 sm:p-6 md:flex-row md:items-start md:gap-8">
        <div className="relative group shrink-0">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(event) => { void onAvatarFileChange(event); }} 
            className="hidden" 
            accept="image/*" 
          />
          <div 
            className="flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-2xl font-bold text-white/90 shadow-md sm:h-24 sm:w-24 sm:text-3xl"
            onClick={handleAvatarClick}
          >
            <img
              src={user.avatar || DEFAULT_NEXUS_AVATAR}
              alt={user.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
              <Camera size={28} className="text-white transform scale-90 group-hover:scale-100 transition-transform" />
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center text-white shadow-md ring-4 ring-bg-card pointer-events-none">
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
              onClick={() => { void handleSaveProfile(); }}
              loading={isSaving}
              leftIcon={saved ? <Check size={18} /> : undefined}
            >
              {saved ? t('settings.saved') : t('settings.saveChanges')}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:gap-8">
        {authProvider === 'anonymous' && (
          <div className="rounded-xl border border-violet-500/20 bg-bg-card p-4 space-y-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                <Lock size={18} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold tracking-tight text-white">{t('settings.linkGuestTitle')}</h3>
                <p className="text-sm leading-6 text-white/55">{t('settings.linkGuestDesc')}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label={t('auth.password')}
                type="password"
                value={linkPassword}
                onChange={(e) => setLinkPassword(e.target.value)}
                placeholder={t('auth.passwordPlaceholder')}
              />
              <Input
                label={t('auth.confirmPassword')}
                type="password"
                value={confirmLinkPassword}
                onChange={(e) => setConfirmLinkPassword(e.target.value)}
                placeholder={t('auth.passwordPlaceholder')}
              />
            </div>

            <div className="flex justify-stretch md:justify-end">
              <Button
                variant="primary"
                className="h-10 w-full md:w-auto"
                onClick={handleLinkGuestAccount}
                loading={isLinking}
              >
                {t('settings.linkGuestAction')}
              </Button>
            </div>
          </div>
        )}

        <div className="rounded-xl border border-border bg-bg-card p-4 space-y-6 sm:p-6">
          <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
            <Globe className="w-4 h-4 text-violet-400" />
            {t('settings.localization')}
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
              defaultValue={t('settings.defaultRegion')} 
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
