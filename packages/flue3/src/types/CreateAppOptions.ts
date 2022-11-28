import { AppContext } from './AppContext.js';
import { definePlugin } from '../defines/definePlugin.js';

export interface CreateAppOptions {
    plugins?: ReturnType<ReturnType<typeof definePlugin>>[];
    entryClient?: (context: AppContext) => Promise<any> | void;
    entryServer?: (context: AppContext) => Promise<any> | void;
    head?: ((context: AppContext) => Record<any, any>) | Record<any, any>;
}
