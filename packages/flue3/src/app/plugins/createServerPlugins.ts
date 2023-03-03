import { serverPluginImports } from 'virtual:flue3ServerPluginImports';
import { AppContext } from '../../types/AppContext.js';
import { ServerPlugin } from '../../types/ServerPlugin.js';

export const createServerPlugins = async (appContext: AppContext) => {
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const plugin of serverPluginImports) {
        try {
            const pluginModule = await plugin();
            const handlerFn = (pluginModule.default ?? pluginModule) as ServerPlugin;
            await handlerFn(appContext);
        } catch (err) {
            console.error('[flue3] fail server plugin initialized', err);
        }
    }
};
