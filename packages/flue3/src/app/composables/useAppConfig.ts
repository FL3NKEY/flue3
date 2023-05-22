import { useAppContext } from './useAppContext.js';

export const useAppConfig = () => {
    const appContext = useAppContext();

    return appContext.config;
};
