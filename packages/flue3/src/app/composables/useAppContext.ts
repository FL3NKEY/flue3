import { AppContext } from '../../types/AppContext.js';
import { useAppContext as useAppContextInternal } from '../context/appContextProvider.js';
import { createError, createRedirectError } from '../../utils/error.js';

export const useAppContext = (): AppContext => {
    const appContext = useAppContextInternal();

    const redirect: AppContext['redirect'] = (location, status) => {
        appContext.redirect(location, status);
        if (appContext.isServer) {
            throw createRedirectError(status);
        }
    };

    const error: AppContext['error'] = (options) => {
        appContext.error(options);
        throw createError(options);
    };

    return {
        ...appContext,
        redirect,
        error,
    };
};
