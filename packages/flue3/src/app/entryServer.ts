import { Component, createApp as createVueApp } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { CreateAppOptions } from '../types/CreateAppOptions.js';
import { SSRTemplatePartials } from '../types/SSRTemplatePartials.js';
import { createAppContext } from './context/createAppContext.js';
import { createAndImplementServerResponse } from './response/createAndImplementServerResponse.js';
import { createFrameworkContext } from './context/createFrameworkContext.js';
import { NodeServerResponse, NodeIncomingMessage } from 'h3';
import { SSRRenderReturns } from '../types/SSRRenderReturns.js';
import { AppHook } from '../types/AppHook.js';
import { SSRManifest } from '../types/SSRManifest.js';
import path from 'path';

export const renderPreloadLink = (file: string) => {
    if (file.endsWith('.js')) {
        return `<link rel="modulepreload" crossorigin href="${file}">`;
    } if (file.endsWith('.css')) {
        return `<link rel="stylesheet" href="${file}">`;
    } if (file.endsWith('.woff')) {
        return ` <link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`;
    } if (file.endsWith('.woff2')) {
        return ` <link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`;
    } if (file.endsWith('.gif')) {
        return ` <link rel="preload" href="${file}" as="image" type="image/gif">`;
    } if (file.endsWith('.jpg') || file.endsWith('.jpeg')) {
        return ` <link rel="preload" href="${file}" as="image" type="image/jpeg">`;
    } if (file.endsWith('.png')) {
        return ` <link rel="preload" href="${file}" as="image" type="image/png">`;
    }

    return '';
};

const renderPreloadLinks = (modules: Set<string>, manifest: SSRManifest) => {
    let links = '';
    const seen = new Set<string>();
    modules.forEach((id) => {
        const files = manifest[id];
        if (files) {
            files.forEach((file) => {
                if (!seen.has(file)) {
                    seen.add(file);
                    const filename = path.basename(file);
                    if (manifest[filename]) {
                        // eslint-disable-next-line no-restricted-syntax
                        for (const depFile of manifest[filename]) {
                            links += renderPreloadLink(depFile);
                            seen.add(depFile);
                        }
                    }
                    links += renderPreloadLink(file);
                }
            });
        }
    });
    return links;
};

export const createUniversalEntry = (
    App: Component,
    options: CreateAppOptions,
    hook: AppHook,
) => {
    const appContext = createAppContext();
    const context = createFrameworkContext(appContext);
    const { deferred } = createAndImplementServerResponse(appContext);

    const implementReq = (req: NodeIncomingMessage) => {
        appContext.req = req;
    };

    const implementRes = (res: NodeServerResponse) => {
        appContext.res = res;
    };

    const render = async (url: string, manifest?: SSRManifest): Promise<SSRRenderReturns | undefined> => {
        const renderPartials: SSRTemplatePartials = {
            htmlAttrs: '',
            bodyAttrs: '',
            headTags: '',
            body: '',
            teleports: {},
        };

        appContext.vueApp = createVueApp(App);

        let hookReturns = {} as Awaited<ReturnType<typeof hook>>;
        const proceedHook = async () => {
            hookReturns = await hook(context);
        };

        await Promise.race([proceedHook(), deferred.promise]);
        if (appContext.isRedirected()) return undefined;

        if (options.entryServer) {
            await options.entryServer(appContext);
            if (appContext.isRedirected()) return undefined;
        }

        await hookReturns.runPluginsHook('beforeRender', renderPartials);

        renderPartials.body += await renderToString(appContext.vueApp, context);
        if (appContext.isRedirected()) return undefined;

        if (manifest) {
            renderPartials.headTags += renderPreloadLinks(context.modules, manifest);
        }

        renderPartials.teleports = {
            ...context.teleports,
            ...renderPartials.teleports,
        };

        await hookReturns.runPluginsHook('afterRender', renderPartials);

        return {
            ...renderPartials,
            initialState: appContext.initialState,
        };
    };

    return {
        context,
        implementReq,
        implementRes,
        render,
    };
};

/* for TypeScript */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export default (() => {}) as () => ReturnType<typeof createUniversalEntry>;
