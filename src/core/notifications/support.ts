export interface BrowserPushSupportState {
  permission: NotificationPermission | 'unsupported';
  supportsNotifications: boolean;
  supportsServiceWorker: boolean;
  supportsPushManager: boolean;
  supportsPush: boolean;
  isSecureContext: boolean;
  isChromiumPreferred: boolean;
}

function isChromiumBrowser() {
  if (typeof window === 'undefined') {
    return false;
  }

  const navigatorData = window.navigator as Navigator & {
    userAgentData?: {
      brands?: Array<{ brand: string; version: string }>;
    };
  };
  const brands = navigatorData.userAgentData?.brands ?? [];

  if (brands.some((brand) => /Chrom(e|ium)|Microsoft Edge/i.test(brand.brand))) {
    return true;
  }

  return /(Chrome|Chromium|Edg)\//i.test(window.navigator.userAgent);
}

export function getBrowserPushSupportState(): BrowserPushSupportState {
  if (typeof window === 'undefined') {
    return {
      permission: 'unsupported',
      supportsNotifications: false,
      supportsServiceWorker: false,
      supportsPushManager: false,
      supportsPush: false,
      isSecureContext: false,
      isChromiumPreferred: false,
    };
  }

  const supportsNotifications = 'Notification' in window;
  const supportsServiceWorker = 'serviceWorker' in window.navigator;
  const supportsPushManager = 'PushManager' in window;
  const permission = supportsNotifications ? Notification.permission : 'unsupported';
  const isSecureContextValue = window.isSecureContext;

  return {
    permission,
    supportsNotifications,
    supportsServiceWorker,
    supportsPushManager,
    supportsPush: supportsNotifications && supportsServiceWorker && supportsPushManager && isSecureContextValue,
    isSecureContext: isSecureContextValue,
    isChromiumPreferred: isChromiumBrowser(),
  };
}
