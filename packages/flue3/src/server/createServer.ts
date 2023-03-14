import {
    createApp as createH3App,
    eventHandler,
    fromNodeMiddleware,
    toNodeListener,
} from 'h3';
import { listen } from 'listhen';
import { writeHead } from '../utils/writeHead.js';
import { htmlTemplateImplementSSR } from '../htmlTemplate/htmlTemplateImplements.js';
import serveStatic from 'serve-static';
import { CreateServerOptions } from '../types/CreateServerOptions.js';
import { createProxyHandler } from './createProxyHandler.js';
import { implementFetchPolyfill, implementPreparedFetchPolyfill } from './implementPreparedFetchPolyfill.js';
import { collectCssTagsFromModules } from '../utils/css.js';
import path from 'path';

implementFetchPolyfill();

export const createServer = async ({
    mode,
    ssr,
    basePath,
    hostname,
    port,
    ssrEntrypoint,
    ssrEntrypointLoader,
    htmlTemplate,
    proxies,
    middlewares,
    ssrManifest,
    publicPath,
    vite,
    entrypointFilePath,
}: CreateServerOptions) => {
    const basePathWithoutSlash = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
    const basePathWithSlash = basePathWithoutSlash + '/';

    implementPreparedFetchPolyfill({
        hostname,
        port,
    });

    const app = createH3App();

    if (middlewares && middlewares.length) {
        middlewares.forEach((middleware) => {
            if ('path' in middleware) {
                app.use(middleware.path, eventHandler(middleware.handler));
            } else {
                app.use(fromNodeMiddleware(middleware));
            }
        });
    }

    if (publicPath) {
        app.use(path.join(basePath, publicPath[0]), fromNodeMiddleware(serveStatic(publicPath[1])));
    }

    if (proxies) {
        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (const key in proxies) {
            const proxyOptions = proxies[key];
            app.use(key, createProxyHandler(proxyOptions));
        }
    }

    app.use('*', eventHandler(async (event) => {
        let template: string;

        if (basePath !== '/') {
            let newLocation = '';
            const basePathExceptedCasesRE = new RegExp(`\\${basePathWithoutSlash}(?!\\/)([#&?^])`, 'g');

            if (String(event.node.req.url) === basePathWithoutSlash
            || basePathExceptedCasesRE.test(String(event.node.req.url))
            ) {
                newLocation = String(event.node.req.url).replace(basePathWithoutSlash, basePathWithSlash);
            } else if (!String(event.node.req.url).startsWith(basePathWithSlash)) {
                newLocation = path.join(basePath, String(event.node.req.url));
            }

            if (newLocation) {
                writeHead(event.node.res, {
                    status: 302,
                    headers: {
                        location: newLocation,
                    },
                });

                return event.node.res.end();
            }
        }

        if (typeof htmlTemplate === 'function') {
            template = await htmlTemplate(String(event.node.req.url));
        } else {
            template = htmlTemplate;
        }

        if (ssr) {
            let currentSsrEntrypoint = ssrEntrypoint;

            if (ssrEntrypointLoader) {
                currentSsrEntrypoint = await ssrEntrypointLoader();
            }

            if (!currentSsrEntrypoint) {
                writeHead(event.node.res, {
                    status: 500,
                });
                return () => 'SSR Entrypoint not provided (expected ssrLoader or ssrEntrypointLoader)';
            }

            const {
                render,
                renderError,
                context,
            } = currentSsrEntrypoint(event, ssrManifest);

            let renderedPartials;

            try {
                renderedPartials = await render();
            } catch (err) {
                if (context.appContext.isRedirected()) {
                    writeHead(event.node.res, context.appContext.response);
                    return event.node.res.end();
                }

                renderedPartials = await renderError(err);
            }

            writeHead(event.node.res, context.appContext.response);

            if (context.appContext.isRedirected()) {
                return event.node.res.end();
            }

            if (mode === 'development' && vite && entrypointFilePath && renderedPartials) {
                const resolvedUrl = await vite.moduleGraph.resolveUrl(entrypointFilePath);
                const mod = await vite.moduleGraph.getModuleById(resolvedUrl[0]);

                if (mod) {
                    const cssTags = collectCssTagsFromModules(mod);
                    renderedPartials.headTags += cssTags;
                }
            }

            template = htmlTemplateImplementSSR(template, renderedPartials);
            await context.appContext.hooks.callHook('render:template', template);
        }

        return template;
    }));

    await listen(toNodeListener(app), {
        baseURL: basePathWithSlash,
        hostname,
        port,
    });
};
