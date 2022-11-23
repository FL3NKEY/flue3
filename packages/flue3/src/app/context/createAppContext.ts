import { App } from 'vue';
import { AppContext } from '../../types/AppContext.js';
import { AppErrorState } from '../../types/AppError.js';
import { clientExternalRedirect } from '../../utils/clientExternalRedirect.js';

export const createAppContext = (): AppContext => {
    return {
        vueApp: {} as App,
        isClient: !import.meta.env.SSR,
        isServer: import.meta.env.SSR,
        initialState: {},
        inject: () => () => console.error('[flue3] inject is not defined yet'),
        writeResponse: () => console.error('[flue3] Do not call writeResponse in browser or is not defined yet'),
        isRedirected: () => false,
        error: () => () => console.error('[flue3] error is not defined yet'),
        errorState: {} as AppErrorState,
        redirect: () => console.error('[flue3] redirect is not defined yet'),
        response: {},
        clientRedirect: clientExternalRedirect,
    };
};
