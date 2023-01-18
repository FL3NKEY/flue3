import { createServer as createViteServer } from 'vite';
import { resolveConfig } from '../config/resolveConfig.js';
import { createViteConfig } from '../vite/createViteConfig.js';
import { Config } from '../types/Config.js';
import { createServer } from '../server/createServer.js';
import { resolveHtmlTemplate } from '../htmlTemplate/resolveHtmlTemplate.js';
import type { createUniversalEntry } from '../app/entryServer.js';
import { WORKDIR } from '../constants/constants.js';
import path from 'path';

type CreateUniversalEntry = ReturnType<typeof createUniversalEntry>;

export const dev = async (configOverwrites?: Config) => {
    const config = await resolveConfig(configOverwrites);
    const viteConfig = createViteConfig(config);
    const vite = await createViteServer(viteConfig);
    const srcPublicPath = path.join(WORKDIR, config.srcPath, 'public');
    const appEntryPath = path.join(WORKDIR, config.srcPath, config.entryFilename);
    const appServerEntryPath = path.join(WORKDIR, config.srcPath, config.entryServerFilename);

    if (config.ssr) {
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
        hostname: config.server.hostname,
        port: config.server.port,
        ssrEntrypointLoader,
        htmlTemplate,
        middlewares: [vite.middlewares],
        publicPath: ['/public', srcPublicPath],
        proxies: config.server.proxies,
        vite,
        entrypointFilePath: appEntryPath,
    });
};
