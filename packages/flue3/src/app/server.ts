import { createServer } from '../server/createServer.js';
import { SSRManifest } from '../types/SSRManifest.js';
import fsp from 'fs/promises';
import url from 'url';
import path from 'path';
import { runtimeConfig } from 'virtual:flue3RuntimeConfig';
import ssrEntrypoint from '#_FLUE3_APP_SSR_ENTRY';

const DIRNAME = url.fileURLToPath(new URL('.', import.meta.url));
const distPath = path.join(DIRNAME, './..');
const htmlTemplatePath = path.join(distPath, 'client/index.html');
const ssrManifestPath = path.join(distPath, 'client/ssr-manifest.json');
const publicPath = path.join(distPath, 'client/public');

(async () => {
    const htmlTemplate = await fsp.readFile(htmlTemplatePath, 'utf-8');
    const manifest: SSRManifest = JSON.parse(await fsp.readFile(ssrManifestPath, 'utf-8'));

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
        publicPath: ['/', publicPath],
    });
})();
