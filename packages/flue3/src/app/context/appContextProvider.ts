const APP_CONTEXT_SYMBOL = Symbol();
import { App, inject } from 'vue';
import { AppContext } from '../../types/AppContext.js';

export const provideAppContext = (vueApp: App, appContext: AppContext) => {
    vueApp.provide(APP_CONTEXT_SYMBOL, appContext);
};

export const useAppContext = () => {
    return inject<AppContext>(APP_CONTEXT_SYMBOL, {} as AppContext);
};
