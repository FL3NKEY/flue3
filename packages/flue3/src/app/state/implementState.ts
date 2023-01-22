import { AppContext } from '../../types/AppContext.js';

export const implementState = (appContext: AppContext) => {
    appContext.inject('writeState', (key: string, data: any) => {
        // eslint-disable-next-line no-param-reassign
        appContext.state[key] = data;
        appContext.hooks.callHook('state:changed', key, data);
    }, true);

    appContext.inject('deleteState', (key: string) => {
        // eslint-disable-next-line no-param-reassign
        delete appContext.state[key];
        appContext.hooks.callHook('state:deleted', key);
    }, true);

    if (FLUE3_SSR_ENABLED && appContext.isClient) {
        // eslint-disable-next-line no-underscore-dangle,no-param-reassign
        appContext.state = (window as any)._FLUE3_INITIAL_STATE;
    }
};
