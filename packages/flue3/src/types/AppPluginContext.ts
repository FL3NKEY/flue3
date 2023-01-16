import { AppContext } from './AppContext.js';
import {
    AppPluginAfterHook,
    AppPluginOnBeforeRenderHook,
    AppPluginOnAfterRenderHook,
    AppPluginOnAfterEntryHook,
} from './AppPluginsHooks.js';

export interface AppPluginContext {
    appContext: AppContext;
    inject: AppContext['inject'];
    onAfterHook: (hook: AppPluginAfterHook) => void;
    onBeforeRender: (hook: AppPluginOnBeforeRenderHook) => void;
    onAfterRender: (hook: AppPluginOnAfterRenderHook) => void;
    onAfterEntry: (hook: AppPluginOnAfterEntryHook) => void;
}
