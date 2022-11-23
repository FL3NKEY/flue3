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
    const config = resolveConfig(configOverwrites);
    const viteConfig = createViteConfig(config);
    const vite = await createViteServer(viteConfig);
    const srcPublicPath = path.join(WORKDIR, config.srcPath, 'public');
    const ssrEntrypoint = async () => {
        const ssrEntrypoint = await vite.ssrLoadModule(String(config.entryFilename));
        return (ssrEntrypoint.default ?? ssrEntrypoint) as CreateUniversalEntry;
    };
    // eslint-disable-next-line no-return-await
    const htmlTemplate = async (url: string) => await vite.transformIndexHtml(url, resolveHtmlTemplate(config.ssr!));

    await createServer({
        ssr: config.ssr,
        mode: 'development',
        hostname: config.server.hostname,
        port: config.server.port,
        ssrEntrypoint,
        htmlTemplate,
        middlewares: [vite.middlewares],
        publicPath: ['/public', srcPublicPath],
    });
};
