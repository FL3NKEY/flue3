import { AppPluginContext } from '../../types/AppPluginContext.js';
import { AppContext } from '../../types/AppContext.js';
import { CreateAppOptions } from '../../types/CreateAppOptions.js';

export const createPlugins = async (plugins: CreateAppOptions['plugins'], appContext: AppContext) => {
    const pluginContext: AppPluginContext = {
        appContext,
        inject: appContext.inject,
    };

    if (plugins && plugins.length > 0) {
        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (const plugin of plugins) {
            try {
                await appContext.callWithContext(() => plugin(pluginContext));
            } catch (err) {
                console.error('[flue3] fail plugin initialized', err);
            }
        }
    }
};
