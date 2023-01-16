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

export const createApp = (
    App: Component,
    options?: CreateAppOptions,
    universalEntry?: (appContext: AppContext) => void,
) => {
    return createUniversalEntry(App, options ?? {}, async (context) => {
        implementCookie(context.appContext);
        implementState(context.appContext);
        provideAppContext(context.appContext.vueApp, context.appContext);
        implementAppError(context.appContext);
        implementAppRedirect(context.appContext);

        const { runPluginsHook } = await createPlugins(options?.plugins, context.appContext);

        if (universalEntry) {
            await universalEntry(context.appContext);
        }

        await runPluginsHook('afterEntry');

        return {
            runPluginsHook,
        };
    });
};
