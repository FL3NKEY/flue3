import { AppPluginsHooks, AppRunPluginsHook } from '../../types/AppPluginsHooks';

export const createPluginsHooks = () => {
    const pluginsHooks: AppPluginsHooks = {
        afterHook: [],
        beforeRender: [],
        afterRender: [],
    };

    const runPluginsHook: AppRunPluginsHook = async (hookName, passedData) => {
        const currentPluginsHooks = pluginsHooks[hookName];

        if (currentPluginsHooks.length <= 0) {
            return;
        }

        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (const pluginHook of currentPluginsHooks) {
            if (pluginHook instanceof Function) {
                try {
                    await pluginHook(passedData);
                } catch (err) {
                    console.error(`[flue3] plugin hook ${hookName} throw error`, err);
                }
            }
        }
    };

    return {
        pluginsHooks,
        runPluginsHook,
    };
};
