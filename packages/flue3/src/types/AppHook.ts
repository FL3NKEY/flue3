import { FrameworkContext } from './FrameworkContext.js';
import { AppRunPluginsHook } from './AppPluginsHooks.js';

export interface AppHookReturns {
    runPluginsHook: AppRunPluginsHook;
}

export type AppHook = (context: FrameworkContext) => Promise<AppHookReturns> | AppHookReturns;
