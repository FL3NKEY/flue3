import { AppContext } from '../../types/AppContext.js';
import { AppInject } from '../../types/AppInject.js';

export const implementAppInjector = (appContext: AppContext) => {
    const inject: AppInject = (key, value, override) => {
        if (!override && appContext.hasOwnProperty(key)) {
            console.error(`[flue3] inject failed. "${key}" already exists in appContext`);
            return;
        }
        // eslint-disable-next-line no-param-reassign
        appContext[key] = value;
        // eslint-disable-next-line no-param-reassign
        appContext.vueApp.config.globalProperties[`${key}`] = value;
    };

    // eslint-disable-next-line no-param-reassign
    appContext.inject = inject;

    return inject;
};
