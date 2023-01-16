import { App } from 'vue';
import { AppContext } from '../../types/AppContext.js';
import { AppErrorState } from '../../types/AppError.js';
import { clientExternalRedirect } from '../../utils/clientExternalRedirect.js';

export const createAppContext = (): AppContext => {
    return {
        vueApp: {} as App,
        isClient: !import.meta.env.SSR,
        isServer: import.meta.env.SSR,
        state: {},
        writeState: () => console.error('[flue3] writeState not defined yet'),
        deleteState: () => {
            console.error('[flue3] deleteState not defined yet');
            return false;
        },
        inject: () => () => console.error('[flue3] inject is not defined yet'),
        writeResponse: () => console.error('[flue3] Do not call writeResponse in browser or is not defined yet'),
        isRedirected: () => false,
        error: () => () => console.error('[flue3] error is not defined yet'),
        clearError: () => () => console.error('[flue3] clearError is not defined yet'),
        errorState: {} as AppErrorState,
        redirect: () => console.error('[flue3] redirect is not defined yet'),
        response: {},
        clientRedirect: clientExternalRedirect,
        setCookie: () => console.error('[flue3] setCookie not defined yet'),
        getCookie: () => {
            console.error('[flue3] getCookie not defined yet');
            return undefined;
        },
        hasCookie: () => {
            console.error('[flue3] hasCookie not defined yet');
            return false;
        },
        removeCookie: () => console.error('[flue3] removeCookie not defined yet'),
    };
};
