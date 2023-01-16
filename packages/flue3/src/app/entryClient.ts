import {
    Component,
    createApp as createVueApp,
    createSSRApp as createVueSSRApp,
} from 'vue';
import { CreateAppOptions } from '../types/CreateAppOptions.js';
import { createFrameworkContext } from './context/createFrameworkContext.js';
import { createAppContext } from './context/createAppContext.js';
import { AppHook } from '../types/AppHook.js';
import { implementAppInjector } from './inject/implementAppInjector.js';
import entryClient from '#_FLUE3_APP_TARGET_ENTRY';
import { createDevtools } from './devtools/createDevtools.js';
import { removeCssHotReloaded } from '../utils/css.js';

export const createUniversalEntry = async (
    App: Component,
    options: CreateAppOptions,
    hook: AppHook,
) => {
    const context = createFrameworkContext();
    context.appContext = createAppContext();

    context.appContext.vueApp = FLUE3_SSR_ENABLED ? createVueSSRApp(App) : createVueApp(App);

    implementAppInjector(context.appContext);

    const hookReturns = await hook(context);
    await hookReturns.runPluginsHook('afterHook');

    await entryClient(context.appContext);

    if (import.meta.env.DEV) {
        createDevtools(context);
        removeCssHotReloaded();
    }

    context.appContext.vueApp.mount(`#${FLUE3_APP_ID}`);

    return {
        context,
    };
};

/* for TypeScript */
// eslint-disable-next-line
export default {} as ReturnType<typeof createUniversalEntry>;
