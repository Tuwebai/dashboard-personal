import { useState } from 'react';
import { toast } from 'sonner';
import { Input } from '../../../shared/ui/Input';
import { Button } from '../../../shared/ui/Button';
import { useI18n } from '../../../shared/i18n/useI18n';
import { useAppStore } from '../../../stores/useAppStore';
import { BrandLogo } from '../../../shared/ui/BrandLogo';
import { mapFirebaseAuthError } from '../lib/mapFirebaseAuthError';

type AuthMode = 'sign-in' | 'sign-up';

export function LoginPage() {
  const { t } = useI18n();
  const authProvider = useAppStore((state) => state.authProvider);
  const signInAnonymously = useAppStore((state) => state.signInAnonymously);
  const signInWithEmail = useAppStore((state) => state.signInWithEmail);
  const signUpWithEmail = useAppStore((state) => state.signUpWithEmail);
  const linkAnonymousAccount = useAppStore((state) => state.linkAnonymousAccount);
  const [mode, setMode] = useState<AuthMode>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isAnonymousSession = authProvider === 'anonymous';

  const handleAnonymousAccess = async () => {
    setIsSubmitting(true);

    try {
      await signInAnonymously();
    } catch (error) {
      toast.error(mapFirebaseAuthError(error, t));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailAccess = async () => {
    if (mode === 'sign-up' && password !== confirmPassword) {
      toast.error(t('auth.passwordMismatch'));
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'sign-up') {
        if (isAnonymousSession) {
          await linkAnonymousAccount(email, password);
          toast.success(t('auth.linkedSuccess'));
        } else {
          await signUpWithEmail(email, password);
        }
      } else {
        await signInWithEmail(email, password);
      }
    } catch (error) {
      toast.error(mapFirebaseAuthError(error, t));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-8">
        <div className="grid w-full overflow-hidden rounded-3xl border border-white/10 bg-bg-card shadow-2xl shadow-black/30 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="hidden flex-col justify-between border-r border-white/10 bg-linear-to-br from-violet-600/15 via-bg-card to-cyan-600/10 p-10 lg:flex">
            <div className="space-y-4">
              <BrandLogo className="h-10 w-auto" />
              <div>
                <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
                  {t('auth.title')}
                </h1>
                <p className="mt-3 max-w-md text-sm leading-6 text-white/60">
                  {t('auth.subtitle')}
                </p>
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                {isAnonymousSession ? t('auth.anonymousBadge') : t('auth.valueBadge')}
              </p>
              <p className="mt-3 text-sm leading-6 text-white/70">
                {t('auth.valueDescription')}
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="mx-auto max-w-md space-y-6">
              <div className="space-y-2 lg:hidden">
                <BrandLogo className="h-9 w-auto" />
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  {t('auth.title')}
                </h1>
                <p className="text-sm text-white/60">{t('auth.subtitle')}</p>
              </div>

              <div className="grid grid-cols-2 rounded-2xl border border-white/10 bg-white/[0.03] p-1">
                <button
                  type="button"
                  onClick={() => setMode('sign-in')}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                    mode === 'sign-in' ? 'bg-violet-600 text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {t('auth.signIn')}
                </button>
                <button
                  type="button"
                  onClick={() => setMode('sign-up')}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                    mode === 'sign-up' ? 'bg-violet-600 text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {t('auth.signUp')}
                </button>
              </div>

              <div className="space-y-4">
                <Input
                  label={t('auth.email')}
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={t('auth.emailPlaceholder')}
                />
                <Input
                  label={t('auth.password')}
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={t('auth.passwordPlaceholder')}
                />
                {mode === 'sign-up' && (
                  <Input
                    label={t('auth.confirmPassword')}
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder={t('auth.passwordPlaceholder')}
                  />
                )}
              </div>

              <div className="space-y-3">
                <Button
                  type="button"
                  variant="primary"
                  className="h-11 w-full"
                  loading={isSubmitting}
                  onClick={handleEmailAccess}
                >
                  {mode === 'sign-up'
                    ? isAnonymousSession
                      ? t('auth.linkAccount')
                      : t('auth.submitSignUp')
                    : t('auth.submitSignIn')}
                </Button>

                {isAnonymousSession && mode === 'sign-up' && (
                  <p className="text-center text-xs text-white/50">{t('auth.linkAccountHint')}</p>
                )}

                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-xs uppercase tracking-[0.2em] text-white/30">
                    {t('auth.orDivider')}
                  </span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  className="h-11 w-full border border-white/10"
                  loading={isSubmitting}
                  onClick={handleAnonymousAccess}
                >
                  {t('auth.continueAnonymous')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
