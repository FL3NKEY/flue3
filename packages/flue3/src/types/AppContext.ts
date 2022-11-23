import { App } from 'vue';
import { NodeServerResponse, NodeIncomingMessage } from 'h3';
import { AppInject } from './AppInject.js';
import { AppError, AppErrorState } from './AppError.js';
import { AppResponse, AppWriteResponse } from './AppResponse.js';

export interface AppContext extends Record<string, any> {
    vueApp: App;
    isClient: boolean;
    isServer: boolean;
    initialState: Record<any, any>;
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
}
