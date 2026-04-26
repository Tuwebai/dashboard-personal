export const APP_MODULES = [
  'dashboard',
  'goals',
  'weekly-planning',
  'journaling',
  'focus',
  'tasks',
  'habits',
  'routines',
  'finances',
  'calendar',
  'notes',
  'settings',
] as const;

export type AppModule = (typeof APP_MODULES)[number];

export const DEFAULT_APP_MODULE: AppModule = 'dashboard';
export const LOGIN_PATH = '/login';

export function isAppModule(module: string): module is AppModule {
  return APP_MODULES.includes(module as AppModule);
}

export function getModuleFromPath(pathname: string): AppModule {
  const module = pathname.replace(/^\/+/, '');

  if (!module || module === 'login' || !isAppModule(module)) {
    return DEFAULT_APP_MODULE;
  }

  return module;
}

export function getModulePath(module: AppModule) {
  return module === DEFAULT_APP_MODULE ? '/' : `/${module}`;
}
