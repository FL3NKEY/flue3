import { Config } from '../types/Config.js';
import { InlineConfig } from 'vite';
import vuePlugin from '@vitejs/plugin-vue';
import path from 'path';
import { WORKDIR, APP_PATH } from '../constants/constants.js';
import { frameworkVitePlugin } from './frameworkVitePlugin.js';
import progressPlugin from 'vite-plugin-progress';

const builtInModules = [
    'assert',
    'buffer',
    'child_process',
    'cluster',
    'crypto',
    'dgram',
    'dns',
    'domain',
    'events',
    'fs',
    'http',
    'https',
    'net',
    'os',
    'path',
    'punycode',
    'querystring',
    'readline',
    'stream',
    'string_decoder',
    'timers',
    'tls',
    'tty',
    'url',
    'util',
    'v8',
    'vm',
    'zlib',
];

const ssrNoExternalPattern = builtInModules.map((name) => `!(${name})`).concat('**');

export const createViteConfig = (config: Config, target: 'server' | 'client' = 'client'): InlineConfig => {
    const srcFullPath = path.join(WORKDIR, config.srcPath);
    const appEntryFullPath = path.join(srcFullPath, config.entryFilename);
    const appEntryClientFullPath = path.join(srcFullPath, config.entryClientFilename);
    const appEntryServerFullPath = path.join(srcFullPath, config.entryServerFilename);
    let outDirFullPath = path.join(WORKDIR, config.outputPath);
    const vHtmlPath = path.join(srcFullPath, 'index.html');
    const serverEntryFullPath = path.join(APP_PATH, 'server.js');
    const srcPublicFullPath = path.join(srcFullPath, 'public');

    if (config.ssr) {
        outDirFullPath = path.join(outDirFullPath, target);
    }

    const outPublicFullPath = path.join(outDirFullPath, 'public');

    return {
        mode: config.mode,
        root: srcFullPath,
        build: {
            ssrManifest: config.ssr && target === 'client' ? true : undefined,
            outDir: outDirFullPath,
            emptyOutDir: true,
            minify: true,
            ssr: config.ssr && target === 'server' ? serverEntryFullPath : undefined,
            rollupOptions: {
                input: {
                    index: vHtmlPath,
                },
            },
            copyPublicDir: false,
            assetsDir: target === 'server' ? 'chunks' : 'public/assets',
            commonjsOptions: {
                transformMixedEsModules: true,
            },
        },
        plugins: [
            frameworkVitePlugin(config, {
                target,
                srcFullPath,
                appEntryFullPath,
                appEntryClientFullPath,
                appEntryServerFullPath,
                vHtmlPath,
                srcPublicFullPath,
                outPublicFullPath,
            }),
            vuePlugin(),
            progressPlugin({
                format: `[flue3] building ${target} [:bar] :percent`,
                clear: true,
            }),
        ],
        ssr: {
            noExternal: [...ssrNoExternalPattern],
        },
        optimizeDeps: {
            exclude: [
                ...(config.exclude || []),
                'flue3',
                '@flue3/router',
            ],
        },
        resolve: {
            alias: {
                '@': srcFullPath,
                '~': WORKDIR,
            },
        },
        define: {
            FLUE3_APP_ID: JSON.stringify(config.appId),
            FLUE3_SSR_ENABLED: config.ssr,
        },
        configFile: false,
        envFile: false,
        appType: 'custom',
        server: {
            middlewareMode: true,
        },
    };
};

export const createViteConfigFactory = (config: Config) => {
    return (target: 'server' | 'client' = 'client') => createViteConfig(config, target);
};
