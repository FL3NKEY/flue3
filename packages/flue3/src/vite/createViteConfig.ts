import { Config } from '../types/Config.js';
import { InlineConfig } from 'vite';
import vuePlugin from '@vitejs/plugin-vue';
import path from 'path';
import { WORKDIR, APP_PATH } from '../constants/constants.js';
import { frameworkVitePlugin } from './frameworkVitePlugin.js';

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
    const outAssetsDir = 'assets';
    const outAssetsDirFullPath = path.join(outDirFullPath, 'assets');

    return {
        mode: config.mode,
        root: srcFullPath,
        base: config.basePath,
        build: {
            manifest: config.ssr && target === 'client' ? true : undefined,
            ssrManifest: config.ssr && target === 'client' ? true : undefined,
            outDir: outDirFullPath,
            emptyOutDir: true,
            minify: config.minify,
            ssr: config.ssr && target === 'server' ? serverEntryFullPath : undefined,
            rollupOptions: {
                input: {
                    index: vHtmlPath,
                },
                output: {
                    assetFileNames: config.mode === 'production' ? () => {
                        return path.join(outAssetsDir, '[name].[hash][extname]');
                    } : undefined,
                },
            },
            assetsDir: target === 'server' ? 'chunks' : outAssetsDir,
            commonjsOptions: {
                transformMixedEsModules: true,
            },
            copyPublicDir: false,
        },
        publicDir: 'public',
        plugins: [frameworkVitePlugin(config, {
            target,
            srcFullPath,
            appEntryFullPath,
            appEntryClientFullPath,
            appEntryServerFullPath,
            vHtmlPath,
            srcPublicFullPath,
            outDirFullPath,
            outAssetsDir,
            outAssetsDirFullPath,
            outPublicFullPath,
            basePath: config.basePath,
        }),
        vuePlugin()],
        ssr: {
            noExternal: [...ssrNoExternalPattern],
        },
        optimizeDeps: {
            exclude: [
                ...(config.excludeDeps || []),
                'flue3',
                '@flue3/router',
            ],
        },
        resolve: {
            alias: {
                '@': srcFullPath,
                '~': WORKDIR,
                ...config.aliases,
            },
        },
        define: {
            FLUE3_APP_ID: JSON.stringify(config.appId),
            FLUE3_SSR_ENABLED: config.ssr,
            FLUE3_BASE_PATH: JSON.stringify(config.basePath),
        },
        configFile: false,
        envPrefix: 'APP_',
        envDir: WORKDIR,
        appType: 'custom',
        server: {
            middlewareMode: true,
        },
    };
};

export const createViteConfigFactory = (config: Config) => {
    return (target: 'server' | 'client' = 'client') => createViteConfig(config, target);
};
