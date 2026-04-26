import { settingsTranslations } from '../../shared/i18n/translations/settings';
import type { Lang } from '../../shared/i18n/translations/types';

export type PersistenceSyncErrorMessageKey =
  | 'settings.syncErrorNetwork'
  | 'settings.syncErrorPermission'
  | 'settings.syncErrorAuth'
  | 'settings.syncErrorPayload'
  | 'settings.syncErrorUnknown';

export interface PersistenceSyncErrorInfo {
  code: 'network' | 'permission' | 'auth' | 'payload' | 'unknown';
  messageKey: PersistenceSyncErrorMessageKey;
  rawCode: string;
  rawMessage: string;
  occurredAt: string;
}

function getFirebaseErrorCode(error: unknown) {
  return typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'string'
    ? error.code
    : '';
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : '';
}

export function resolvePersistenceSyncError(error: unknown): PersistenceSyncErrorInfo {
  const code = getFirebaseErrorCode(error);
  const message = getErrorMessage(error);
  const baseError = {
    rawCode: code,
    rawMessage: message,
    occurredAt: new Date().toISOString(),
  };

  if (message === 'persistence/invalid-remote-payload') {
    return { code: 'payload', messageKey: 'settings.syncErrorPayload', ...baseError };
  }

  if (
    code.includes('permission-denied') ||
    code.includes('insufficient-permission')
  ) {
    return { code: 'permission', messageKey: 'settings.syncErrorPermission', ...baseError };
  }

  if (
    code.includes('unauthenticated') ||
    code.startsWith('auth/')
  ) {
    return { code: 'auth', messageKey: 'settings.syncErrorAuth', ...baseError };
  }

  if (
    code.includes('unavailable') ||
    code.includes('deadline-exceeded') ||
    code.includes('network-request-failed') ||
    message.toLowerCase().includes('network')
  ) {
    return { code: 'network', messageKey: 'settings.syncErrorNetwork', ...baseError };
  }

  return { code: 'unknown', messageKey: 'settings.syncErrorUnknown', ...baseError };
}

export function getLocalizedSyncNotification(lang: Lang, error: PersistenceSyncErrorInfo) {
  return {
    title: settingsTranslations[lang]['settings.syncNotificationTitle'],
    message: `${settingsTranslations[lang][error.messageKey]} ${settingsTranslations[lang]['settings.syncNotificationFallback']}`.trim(),
  };
}
