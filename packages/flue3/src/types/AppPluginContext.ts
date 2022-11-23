import { AppContext } from './AppContext.js';
import {
    AppPluginAfterHook,
    AppPluginOnBeforeRenderHook,
    AppPluginOnAfterRenderHook,
} from './AppPluginsHooks.js';

export interface AppPluginContext {
    appContext: AppContext;
    inject: AppContext['inject'];
    afterHook: (hook: AppPluginAfterHook) => void;
    onBeforeRender: (hook: AppPluginOnBeforeRenderHook) => void;
    onAfterRender: (hook: AppPluginOnAfterRenderHook) => void;
}
