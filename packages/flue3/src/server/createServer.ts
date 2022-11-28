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

export const createServer = async ({
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
                    statusText: 'SSR Entrypoint not provided (expected ssrLoader or ssrEntrypointLoader)',
                });
                return event.node.res.end();
            }

            const {
                render,
                context,
            } = currentSsrEntrypoint(event, manifest);

            const renderedPartials = await render();
            writeHead(event.node.res, context.appContext.response);

            if (context.appContext.isRedirected()) {
                return event.node.res.end();
            }

            /*
            const mods = await vite.moduleGraph.getModuleByUrl('/app.vue');
            if (mods) {
                console.log(mods);
                // eslint-disable-next-line no-restricted-syntax
                for (const mod of mods.importedModules) {
                    if (
                        (mod.file?.endsWith('.scss')
                            || mod.file?.endsWith('.css')
                            || mod.id?.includes('vue&type=style'))
                        && mod.ssrModule
                    ) {
                        console.log(mod);
                        ssrImplements.headTags +=
                        `<style type="text/css" data-vite-dev-id="${mod.id}">${mod.ssrModule.default}</style>`;
                    }
                }
            }
             */

            template = htmlTemplateImplementSSR(template, renderedPartials);
        }

        return template;
    }));

    await listen(toNodeListener(app), {
        hostname,
        port,
    });
};
