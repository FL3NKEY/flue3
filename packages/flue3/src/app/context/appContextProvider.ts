const APP_CONTEXT_SYMBOL = Symbol();
import {
    App,
    inject,
    getCurrentInstance,
} from 'vue';
import { AppContext } from '../../types/AppContext.js';

export const provideAppContext = (vueApp: App, appContext: AppContext) => {
    vueApp.provide(APP_CONTEXT_SYMBOL, appContext);
};

export const useAppContext = () => {
    const appContext = inject<AppContext | null>(APP_CONTEXT_SYMBOL, null);
    const isVueInstance = Boolean(getCurrentInstance());

    if (!appContext) {
        console.error('[flue3] you cannot use appContext there');
    }

    return {
        appContext,
        isVueInstance,
    } as {
        appContext: AppContext;
        isVueInstance: boolean;
    };
};
