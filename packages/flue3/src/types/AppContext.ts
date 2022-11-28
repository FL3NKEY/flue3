import { App } from 'vue';
import { NodeServerResponse, NodeIncomingMessage } from 'h3';
import { AppInject } from './AppInject.js';
import { AppError, AppErrorState } from './AppError.js';
import { AppResponse, AppWriteResponse } from './AppResponse.js';
import { Cookie } from './Cookie.js';

export interface AppContext extends Record<string, any> {
    vueApp: App;
    isClient: boolean;
    isServer: boolean;
    state: Record<any, any>;
    writeState: (name: string, data: any) => void;
    req?: NodeIncomingMessage;
    res?: NodeServerResponse;
    inject: AppInject;
    error: AppError;
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
}
