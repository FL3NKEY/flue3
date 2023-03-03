import { useAppContext } from '../context/appContextProvider.js';

export const useAppConfig = () => {
    const appContext = useAppContext();

    return appContext.config;
};
