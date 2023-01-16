import { useAppContext } from './useAppContext.js';
import { AppContext } from '../../types/AppContext.js';

export const useMiddleware = async (middleware: (appContext: AppContext) => Promise<void> | void) => {
    const appContext = useAppContext();
    await middleware(appContext);
};
