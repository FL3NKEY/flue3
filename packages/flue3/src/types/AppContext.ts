import { App } from 'vue';
import { NodeServerResponse, NodeIncomingMessage } from 'h3';
import { AppInject } from './AppInject.js';
import { AppError, AppErrorState } from './AppError.js';
import { AppResponse, AppWriteResponse } from './AppResponse.js';
import { Cookie } from './Cookie.js';
import { Hookable } from 'hookable';
import { AppHooks } from './AppHooks.js';
import { AppState } from './AppState.js';
import { AppConfig } from './AppConfig.js';

export interface AppContext extends Record<string, any> {
    basePath: string;
    config: AppConfig;
    vueApp: App;
    isClient: boolean;
    isServer: boolean;
    state: AppState;
    req?: NodeIncomingMessage;
    res?: NodeServerResponse;
    inject: AppInject;
    error: AppError;
    clearError: () => void;
    errorState: AppErrorState;
    redirect: (location: string, status?: number) => void;
    response: AppResponse;
    writeResponse: AppWriteResponse;
    isRedirected: () => boolean;
    clientRedirect: (location: string, status?: number) => void;
    setCookie: Cookie['set'];
    getCookie: Cookie['get'];
    hasCookie: Cookie['has'];
    removeCookie: Cookie['remove'];
    hooks: Hookable<AppHooks>;
    callWithContext: (fn: () => any) => Promise<any>;
}
