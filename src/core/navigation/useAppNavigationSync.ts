import { useEffect, useRef } from 'react';
import { getModuleFromPath, getModulePath, LOGIN_PATH, type AppModule } from './routes';

export function useAppNavigationSync(
  activeModule: AppModule,
  authStatus: string,
  setActiveModule: (module: AppModule) => void,
) {
  const initialPathHydratedRef = useRef(false);

  useEffect(() => {
    if (authStatus === 'loading') {
      return;
    }

    if (authStatus !== 'authenticated') {
      initialPathHydratedRef.current = false;
      return;
    }

    if (initialPathHydratedRef.current) {
      return;
    }

    const moduleFromPath = getModuleFromPath(window.location.pathname);

    if (activeModule !== moduleFromPath) {
      setActiveModule(moduleFromPath);
      return;
    }

    initialPathHydratedRef.current = true;
  }, [activeModule, authStatus, setActiveModule]);

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname === LOGIN_PATH) {
        return;
      }

      initialPathHydratedRef.current = true;
      setActiveModule(getModuleFromPath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setActiveModule]);

  useEffect(() => {
    if (authStatus === 'loading') {
      return;
    }

    if (authStatus !== 'authenticated') {
      if (window.location.pathname !== LOGIN_PATH) {
        window.history.replaceState(null, '', LOGIN_PATH);
      }
      return;
    }

    if (!initialPathHydratedRef.current) {
      return;
    }

    const path = getModulePath(activeModule);

    if (window.location.pathname !== path) {
      window.history.pushState({ module: activeModule }, '', path);
    }
  }, [activeModule, authStatus]);
}
