import { createServer } from '../server/createServer.js';
import { SSRManifest } from '../types/SSRManifest.js';
import fsp from 'fs/promises';
import url from 'url';
import path from 'path';
import { runtimeConfig } from 'virtual:flue3RuntimeConfig';
import ssrEntrypoint from '#_FLUE3_APP_SSR_ENTRY';
import { ServerMiddleware, ServerMiddlewareRecord } from '../types/ServerMiddleware.js';
import { serverMiddlewareImports } from 'virtual:flue3ServerMiddlewareImports';

const DIRNAME = url.fileURLToPath(new URL('.', import.meta.url));
const distPath = path.join(DIRNAME, './..');
const htmlTemplatePath = path.join(distPath, 'client/index.html');
const ssrManifestPath = path.join(distPath, 'client/ssr-manifest.json');
const publicPath = path.join(distPath, 'client/public');

(async () => {
    const htmlTemplate = await fsp.readFile(htmlTemplatePath, 'utf-8');
    const manifest: SSRManifest = JSON.parse(await fsp.readFile(ssrManifestPath, 'utf-8'));
    const serverMiddlewares: ServerMiddlewareRecord[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const { path, handler } of runtimeConfig.server.middleware) {
        const handlerModule = await serverMiddlewareImports[handler]();
        const handlerFn = (handlerModule.default ?? handlerModule) as ServerMiddleware;

        serverMiddlewares.push({
            path,
            handler: handlerFn(runtimeConfig.appConfig),
        });
    }

    await createServer({
        ssr: true,
        mode: 'production',
        basePath: runtimeConfig.basePath,
        hostname: runtimeConfig.server.hostname,
        port: runtimeConfig.server.port,
        proxies: runtimeConfig.server.proxies,
        ssrEntrypoint,
        htmlTemplate,
        manifest,
        middlewares: [...serverMiddlewares],
        publicPath: ['/', publicPath],
    });
})();
