import { definePlugin } from '../defines/definePlugin.js';

export interface CreateAppOptions {
    plugins?: ReturnType<ReturnType<typeof definePlugin>>[];
}
