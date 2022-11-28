import { AppContext } from '../../types/AppContext.js';

export const implementState = (appContext: AppContext) => {
    // eslint-disable-next-line no-param-reassign
    appContext.inject('writeState', (propName: string, data: any) => {
        // eslint-disable-next-line no-param-reassign
        appContext.state[propName] = data;
    });

    if (FLUE3_SSR_ENABLED && appContext.isClient) {
        // eslint-disable-next-line no-underscore-dangle,no-param-reassign
        appContext.state = (window as any)._FLUE3_INITIAL_STATE;
    }
};
