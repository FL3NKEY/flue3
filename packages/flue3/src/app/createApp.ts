import { createUniversalEntry } from '#_FLUE3_UNIVERSAL_ENTRY';
import { Component } from 'vue';
import { CreateAppOptions } from '../types/CreateAppOptions.js';
import { provideAppContext } from './context/appContextProvider.js';
import { AppContext } from '../types/AppContext.js';
import { implementAppError } from './error/implementAppError.js';
import { implementAppRedirect } from './redirect/implementAppRedirect.js';
import { createPlugins } from './plugins/createPlugins.js';
import { implementState } from './state/implementState.js';
import { implementCookie } from './cookie/implementCookie.js';
import { implementAppHooks } from './hooks/implementAppHooks.js';
import { implementCallWithContext } from './context/implementCallWithContext.js';

export const createApp = (
    App: Component,
    options?: CreateAppOptions,
    universalEntry?: (appContext: AppContext) => void,
) => createUniversalEntry(App, options ?? {}, async (context) => {
    implementCallWithContext(context.appContext);
    implementAppHooks(context.appContext);
    implementCookie(context.appContext);
    implementState(context.appContext);
    provideAppContext(context.appContext.vueApp, context.appContext);
    implementAppError(context.appContext);
    implementAppRedirect(context.appContext);
    await createPlugins(options?.plugins, context.appContext);

    if (universalEntry) {
        await context.appContext.callWithContext(() => universalEntry(context.appContext));
    }

    await context.appContext.hooks.callHook('entry:after');
});
