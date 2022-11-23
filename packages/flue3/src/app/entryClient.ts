import { Component, createApp as createVueApp } from 'vue';
import { CreateAppOptions } from '../types/CreateAppOptions.js';
import { createFrameworkContext } from './context/createFrameworkContext.js';
import { createAppContext } from './context/createAppContext.js';
import { implementClientInitialState } from './initialState/implementClientInitialState.js';
import { AppHook } from '../types/AppHook.js';

export const createUniversalEntry = async (
    App: Component,
    options: CreateAppOptions,
    hook: AppHook,
) => {
    const appContext = createAppContext();
    const context = createFrameworkContext(appContext);
    implementClientInitialState(appContext);

    appContext.vueApp = createVueApp(App);

    await hook(context);

    if (options.entryClient) {
        await options.entryClient(appContext);
    }

    appContext.vueApp.mount(`#${FLUE3_APP_ID}`, FLUE3_SSR_ENABLED);

    return {
        context,
    };
};

/* for TypeScript */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export default (() => {}) as () => ReturnType<typeof createUniversalEntry>;
