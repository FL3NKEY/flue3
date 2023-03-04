import { createServer as createViteServer } from 'vite';
import { resolveConfig } from '../config/resolveConfig.js';
import { createViteConfig } from '../vite/createViteConfig.js';
import { Config } from '../types/Config.js';
import { createServer } from '../server/createServer.js';
import { resolveHtmlTemplate } from '../htmlTemplate/resolveHtmlTemplate.js';
import type { createUniversalEntry } from '../app/entryServer.js';
import { WORKDIR } from '../constants/constants.js';
import path from 'path';
import { ServerMiddlewareRecord, ServerMiddleware } from '../types/ServerMiddleware.js';

type CreateUniversalEntry = ReturnType<typeof createUniversalEntry>;

export const dev = async (configOverwrites?: Config) => {
    const config = await resolveConfig(configOverwrites);
    const viteConfig = createViteConfig(config);
    const vite = await createViteServer(viteConfig);
    const appEntryPath = path.join(WORKDIR, config.srcPath, config.entryFilename);
    const appServerEntryPath = path.join(WORKDIR, config.srcPath, config.entryServerFilename);
    const serverMiddlewares: ServerMiddlewareRecord[] = [];
    const resolvedServerMiddlewaresUrls: Awaited<ReturnType<typeof vite.moduleGraph.resolveUrl>>[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const { path, handler } of config.server.middleware) {
        const handlerModule = await vite.ssrLoadModule(handler);
        const handlerFn = (handlerModule.default ?? handlerModule) as ServerMiddleware;

        serverMiddlewares.push({
            path,
            handler: handlerFn(config.appConfig),
        });

        resolvedServerMiddlewaresUrls.push(await vite.moduleGraph.resolveUrl(handler));
    }

    // watch for server middleware
    /*
     * @todo restart server when middleware change
    vite.watcher.on('change', async (filePath) => {
        if (resolvedServerMiddlewaresUrls.some((resolvedUrl) => resolvedUrl.includes(filePath))) {
            return;
        }

        const resolvedUrl = await vite.moduleGraph.resolveUrl(filePath);
        const mod = await vite.moduleGraph.getModuleById(resolvedUrl[0]);

        if (!mod) {
            return;
        }

        // restart server
    });
    */

    if (config.ssr) {
        // watch for server entry file
        vite.watcher.on('change', async (filePath) => {
            if (!filePath.startsWith(appServerEntryPath)) {
                return;
            }

            const resolvedUrl = await vite.moduleGraph.resolveUrl(appEntryPath);
            const mod = await vite.moduleGraph.getModuleById(resolvedUrl[0]);

            if (!mod) {
                return;
            }

            await vite.reloadModule(mod);
        });
    }

    const ssrEntrypointLoader = async () => {
        const ssrEntrypoint = await vite.ssrLoadModule(String(config.entryFilename));
        return (ssrEntrypoint.default ?? ssrEntrypoint) as CreateUniversalEntry;
    };
    // eslint-disable-next-line no-return-await
    const htmlTemplate = async (url: string) => await vite.transformIndexHtml(url, resolveHtmlTemplate(config));

    await createServer({
        ssr: config.ssr,
        mode: 'development',
        basePath: config.basePath,
        hostname: config.server.hostname,
        port: config.server.port,
        ssrEntrypointLoader,
        htmlTemplate,
        middlewares: [vite.middlewares, ...serverMiddlewares],
        proxies: config.server.proxies,
        vite,
        entrypointFilePath: appEntryPath,
    });
};
