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

export const createServer = async ({
    ssr,
    mode,
    hostname,
    port,
    ssrEntrypoint,
    htmlTemplate,
    proxies,
    middlewares,
    manifest,
    publicPath,
}: CreateServerOptions) => {
    const app = createH3App();

    if (middlewares && middlewares.length) {
        middlewares.forEach((middleware) => app.use(fromNodeMiddleware(middleware)));
    }

    console.log(proxies, mode);

    if (publicPath) {
        app.use(publicPath[0], fromNodeMiddleware(serveStatic(publicPath[1])));
    }

    app.use('*', eventHandler(async ({ req, res }) => {
        const url = req.url;
        let template: string;

        if (typeof htmlTemplate === 'function') {
            template = await htmlTemplate(url!);
        } else {
            template = htmlTemplate;
        }

        if (ssr) {
            const currentSsrEntrypoint = await ssrEntrypoint(url!);

            const {
                implementReq,
                implementRes,
                render,
                context,
            } = currentSsrEntrypoint;

            implementReq(req);
            implementRes(res);

            const renderedPartials = await render(url!, manifest);

            if (context.appContext.isRedirected()) {
                writeHead(res, context.appContext.response);
                return res.end();
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
