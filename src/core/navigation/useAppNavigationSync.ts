import { useEffect } from 'react';
import { getModuleFromPath, getModulePath, LOGIN_PATH, type AppModule } from './routes';

export function useAppNavigationSync(
  activeModule: AppModule,
  authStatus: string,
  setActiveModule: (module: AppModule) => void,
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
    const path = authStatus === 'authenticated' ? getModulePath(activeModule) : LOGIN_PATH;

    if (window.location.pathname !== path) {
      window.history.pushState({ module: activeModule }, '', path);
    }
  }, [activeModule, authStatus]);
}
