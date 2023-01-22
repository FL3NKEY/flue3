import { AppContext } from './AppContext.js';

export interface AppPluginContext {
    appContext: AppContext;
    inject: AppContext['inject'];
}
