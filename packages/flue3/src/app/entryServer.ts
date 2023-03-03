import { Component, createApp as createVueApp } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { CreateAppOptions } from '../types/CreateAppOptions.js';
import { SSRTemplatePartials } from '../types/SSRTemplatePartials.js';
import { createAppContext } from './context/createAppContext.js';
import { createSSRContext } from './context/createSSRContext.js';
import { createAndImplementServerResponse } from './response/createAndImplementServerResponse.js';
import { createFrameworkContext } from './context/createFrameworkContext.js';
import { SSRRenderReturns } from '../types/SSRRenderReturns.js';
import { CreateApp } from '../types/CreateApp.js';
import { SSRManifest } from '../types/SSRManifest.js';
import { H3Event } from 'h3';
import { implementAppInjector } from './inject/implementAppInjector.js';
import { renderPreloadLinks } from '../utils/preloadLinks.js';
import entryServer from '#_FLUE3_APP_TARGET_ENTRY';
import { createServerPlugins } from './plugins/createServerPlugins.js';

export const createUniversalEntry = (
    App: Component,
    options: CreateAppOptions,
    createApp: CreateApp,
) => {
    return (serverEvent: H3Event, manifest?: SSRManifest) => {
        const context = createFrameworkContext();

        const render = async (beforeRender?: () => void): Promise<SSRRenderReturns | undefined> => {
            context.appContext = createAppContext();
            context.ssrContext = createSSRContext();

            context.appContext.req = serverEvent.node.req;
            context.appContext.res = serverEvent.node.res;

            const renderPartials: SSRTemplatePartials = {
                htmlAttrs: '',
                bodyAttrs: '',
                headTags: '',
                body: '',
                teleports: {},
            };

            context.appContext.vueApp = createVueApp(App);

            implementAppInjector(context.appContext);
            const { redirectDefer } = createAndImplementServerResponse(context.appContext);

            await Promise.race([createApp(context), redirectDefer.promise]);
            await createServerPlugins(context.appContext);
            await context.appContext.hooks.callHook('app:created');
            if (context.appContext.isRedirected()) return undefined;

            await entryServer(context.appContext);
            if (context.appContext.isRedirected()) return undefined;

            await context.appContext.hooks.callHook('render:before', renderPartials);
            if (beforeRender) {
                beforeRender();
            }

            renderPartials.body += await renderToString(context.appContext.vueApp, context.ssrContext);
            if (context.appContext.isRedirected()) return undefined;

            if (manifest) {
                renderPartials.headTags += renderPreloadLinks(context.ssrContext.modules, manifest);
            }

            renderPartials.teleports = {
                ...context.ssrContext.teleports,
                ...renderPartials.teleports,
            };

            await context.appContext.hooks.callHook('render:after', renderPartials);
            if (context.appContext.isRedirected()) return undefined;

            return {
                ...renderPartials,
                initialState: context.appContext.state,
            };
        };

        const renderError = async (err: any) => {
            // eslint-disable-next-line no-return-await
            return await render(() => {
                context.appContext.error(err);
            });
        };

        return {
            context,
            render,
            renderError,
        };
    };
};

/* for TypeScript */
// eslint-disable-next-line
export default ((serverEvent, manifest?) => {}) as ReturnType<typeof createUniversalEntry>;
