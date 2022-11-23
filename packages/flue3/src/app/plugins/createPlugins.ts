import { createPluginsHooks } from './createPluginsHooks.js';
import { AppPluginContext } from '../../types/AppPluginContext.js';
import { AppContext } from '../../types/AppContext.js';
import { CreateAppOptions } from '../../types/CreateAppOptions.js';

export const createPlugins = async (plugins: CreateAppOptions['plugins'], appContext: AppContext) => {
    const { pluginsHooks, runPluginsHook } = createPluginsHooks();

    const pluginContext: AppPluginContext = {
        appContext,
        inject: appContext.inject,
        afterHook: (hook) => pluginsHooks.afterHook.push(hook),
        onBeforeRender: (hook) => pluginsHooks.beforeRender.push(hook),
        onAfterRender: (hook) => pluginsHooks.afterRender.push(hook),
    };

    if (plugins && plugins.length > 0) {
        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (const plugin of plugins) {
            try {
                await plugin(pluginContext);
            } catch (err) {
                console.error('[flue3] fail plugin initialized', err);
            }
        }
    }

    return {
        pluginsHooks,
        runPluginsHook,
    };
};
