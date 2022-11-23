import { AppContext } from './AppContext.js';
import { definePlugin } from '../defines/definePlugin.js';

export interface CreateAppOptions {
    layouts?: Record<string, any>; // todo
    plugins?: ReturnType<ReturnType<typeof definePlugin>>[]; // todo
    middlewares?: any[]; // todo
    entryClient?: (context: AppContext) => Promise<any> | void;
    entryServer?: (context: AppContext) => Promise<any> | void;
    head?: ((context: AppContext) => Record<any, any>) | Record<any, any>;
}
