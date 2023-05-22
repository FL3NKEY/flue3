import { AppContext } from '../../types/AppContext.js';
import { reactive } from 'vue';

export const implementState = (appContext: AppContext) => {
    if (FLUE3_SSR_ENABLED && appContext.isClient) {
        // eslint-disable-next-line no-underscore-dangle,no-param-reassign
        appContext.state = reactive((window as any)._FLUE3_INITIAL_STATE);
    }
};
