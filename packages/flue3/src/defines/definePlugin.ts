import { AppPluginContext } from '../types/AppPluginContext.js';

export const definePlugin = <T extends Record<any, any> | undefined>(
    plugin: (pluginContext: AppPluginContext, options: T) => void,
) => (options?: T) => (pluginContext: AppPluginContext) => plugin(pluginContext, options!);

export const defineStandalonePlugin = (plugin: (pluginContext: AppPluginContext) => void) => plugin;
