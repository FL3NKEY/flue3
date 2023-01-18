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
import { implementFetchPolyfill } from './implementFetchPolyfill.js';
import { collectCssTagsFromModules } from '../utils/css.js';

export const createServer = async ({
    mode,
    ssr,
    hostname,
    port,
    ssrEntrypoint,
    ssrEntrypointLoader,
    htmlTemplate,
    proxies,
    middlewares,
    manifest,
    publicPath,
    vite,
    entrypointFilePath,
}: CreateServerOptions) => {
    implementFetchPolyfill({
        hostname,
        port,
    });

    const app = createH3App();

    if (middlewares && middlewares.length) {
        middlewares.forEach((middleware) => app.use(fromNodeMiddleware(middleware)));
    }

    if (publicPath) {
        app.use(publicPath[0], fromNodeMiddleware(serveStatic(publicPath[1])));
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
            } = currentSsrEntrypoint(event, manifest);

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
        }

        return template;
    }));

    await listen(toNodeListener(app), {
        hostname,
        port,
    });
};
