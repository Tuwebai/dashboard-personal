import { useEffect } from 'react';

const DEFAULT_MODULE = 'dashboard';
const LOGIN_PATH = '/login';

function getModuleFromPath(pathname: string) {
  const module = pathname.replace(/^\/+/, '');

  if (!module || module === 'login') {
    return DEFAULT_MODULE;
  }

  return module;
}

function getPathFromModule(activeModule: string, authStatus: string) {
  if (authStatus !== 'authenticated') {
    return LOGIN_PATH;
  }

  return activeModule === DEFAULT_MODULE ? '/' : `/${activeModule}`;
}

export function useAppNavigationSync(
  activeModule: string,
  authStatus: string,
  setActiveModule: (module: string) => void,
) {
  useEffect(() => {
    setActiveModule(getModuleFromPath(window.location.pathname));
  }, [authStatus, setActiveModule]);

  useEffect(() => {
    const handlePopState = () => {
      setActiveModule(getModuleFromPath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setActiveModule]);

  useEffect(() => {
    const path = getPathFromModule(activeModule, authStatus);

    if (window.location.pathname !== path) {
      window.history.pushState({ module: activeModule }, '', path);
    }
  }, [activeModule, authStatus]);
}
