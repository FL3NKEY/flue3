import { App, reactive } from 'vue';
import { AppContext } from '../../types/AppContext.js';
import { AppErrorState } from '../../types/AppError.js';
import { clientExternalRedirect } from '../../utils/clientExternalRedirect.js';
import { Hookable } from 'hookable';
import { AppHooks } from '../../types/AppHooks.js';
import { appConfig } from 'virtual:flue3AppConfig';

export const createAppContext = (): AppContext => {
    return {
        basePath: FLUE3_BASE_PATH,
        config: appConfig,
        vueApp: {} as App,
        isClient: !import.meta.env.SSR,
        isServer: import.meta.env.SSR,
        state: reactive({}),
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
        hooks: {} as Hookable<AppHooks>,
        callWithContext: async () => {
            console.error('[flue3] callWithAppContext not defined yet');
        },
    };
};
