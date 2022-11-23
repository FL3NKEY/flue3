import { SSRTemplatePartials } from './SSRTemplatePartials.js';

export type AppPluginAfterHook = () => Promise<void> | void;
export type AppPluginOnBeforeRenderHook = (renderPartials: SSRTemplatePartials) => Promise<void> | void;
export type AppPluginOnAfterRenderHook = (renderPartials: SSRTemplatePartials) => Promise<void> | void;

export interface AppPluginsHooks {
    afterHook: AppPluginAfterHook[];
    beforeRender: AppPluginOnBeforeRenderHook[];
    afterRender: AppPluginOnAfterRenderHook[];
}

export type AppRunPluginsHook = (hookName: keyof AppPluginsHooks, passedData?: any) => Promise<void>;
