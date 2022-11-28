import {
    Component,
    createApp as createVueApp,
    createSSRApp as createVueSSRApp,
} from 'vue';
import { CreateAppOptions } from '../types/CreateAppOptions.js';
import { createFrameworkContext } from './context/createFrameworkContext.js';
import { createAppContext } from './context/createAppContext.js';
import { AppHook } from '../types/AppHook.js';

export const createUniversalEntry = async (
    App: Component,
    options: CreateAppOptions,
    hook: AppHook,
) => {
    const appContext = createAppContext();
    const context = createFrameworkContext(appContext);

    appContext.vueApp = FLUE3_SSR_ENABLED ? createVueSSRApp(App) : createVueApp(App);

    await hook(context);

    if (options.entryClient) {
        await options.entryClient(appContext);
    }

    appContext.vueApp.mount(`#${FLUE3_APP_ID}`);

    return {
        context,
    };
};

/* for TypeScript */
// eslint-disable-next-line
export default {} as ReturnType<typeof createUniversalEntry>;
