import { Plugin, Manifest } from 'vite';
import fs from 'fs-extra';
import { resolveHtmlTemplate } from '../htmlTemplate/resolveHtmlTemplate.js';
import { Config } from '../types/Config.js';
import { RuntimeConfig } from '../types/RuntimeConfig.js';
import { copyFiles } from '../utils/copyFiles.js';
import path from 'path';
import { APP_PATH } from '../constants/constants.js';
import { SSRManifest } from '../types/SSRManifest.js';
import { ssrManifestImplementCssImportsCollision } from '../utils/ssrManifest.js';

export const frameworkVitePlugin = (config: Config, pluginConfig: {
    target: 'server' | 'client';
    srcFullPath: string;
    appEntryFullPath: string;
    appEntryClientFullPath: string;
    appEntryServerFullPath: string;
    vHtmlPath: string;
    srcPublicFullPath: string;
    outDirFullPath: string;
    outAssetsDir: string;
    outAssetsDirFullPath: string;
    outPublicFullPath: string;
    basePath: string;
}): Plugin => {
    const vAppConfig = 'virtual:flue3AppConfig';
    const vRuntimeConfig = 'virtual:flue3RuntimeConfig';
    const vFallbackFn = 'virtual:flue3FnFallback';
    const vServerMiddlewareImports = 'virtual:flue3ServerMiddlewareImports';
    const vServerPluginImports = 'virtual:flue3ServerPluginImports';
    const resolvedVAppConfig = '\0' + vAppConfig;
    const resolvedVRuntimeConfig = '\0' + vRuntimeConfig;
    const resolvedVFallbackFn = '\0' + vFallbackFn;
    const resolvedVServerMiddlewareImports = '\0' + vServerMiddlewareImports;
    const resolvedVServerPluginImports = '\0' + vServerPluginImports;

    let viteCommand: 'build' | 'serve' = 'build';
    let isVHtml = false;

    return {
        name: 'flue3',
        async config(viteConfig, { command }) {
            viteCommand = command;

            if (viteCommand === 'build') {
                if (!fs.existsSync(pluginConfig.vHtmlPath)) {
                    isVHtml = true;

                    await fs.outputFile(pluginConfig.vHtmlPath, resolveHtmlTemplate(config));
                }
            }
        },
        // eslint-disable-next-line consistent-return
        async resolveId(id, importer, resolveOptions) {
            const resolveUniversalEntrypointPath = (ssr = false) => {
                return path.join(APP_PATH, ssr ? 'entryServer' : 'entryClient');
            };
            const resolveAppTargetEntrypointPath = (ssr = false) => {
                return ssr ? pluginConfig.appEntryServerFullPath : pluginConfig.appEntryClientFullPath;
            };

            const aliasResolves: Record<string, string> = {
                '#_FLUE3_UNIVERSAL_ENTRY': resolveUniversalEntrypointPath(resolveOptions.ssr),
                '#_FLUE3_APP_TARGET_ENTRY': resolveAppTargetEntrypointPath(resolveOptions.ssr),
                '#_FLUE3_APP_SSR_ENTRY': pluginConfig.appEntryFullPath,
            };

            // eslint-disable-next-line guard-for-in,no-restricted-syntax
            for (const key in aliasResolves) {
                const aliasResolve = aliasResolves[key as keyof typeof aliasResolves];

                if (id === key) {
                    const resolved = await this.resolve(aliasResolve, importer, {
                        skipSelf: true,
                        ...resolveOptions,
                    });

                    if (resolved) {
                        return resolved;
                    }

                    if (['#_FLUE3_APP_TARGET_ENTRY'].includes(key)) {
                        return resolvedVFallbackFn;
                    }
                }
            }

            switch (id) {
            case vRuntimeConfig:
                return resolvedVRuntimeConfig;
            case vAppConfig:
                return resolvedVAppConfig;
            case vServerMiddlewareImports:
                return resolvedVServerMiddlewareImports;
            case vServerPluginImports:
                return resolvedVServerPluginImports;
            default:
            }
        },
        // eslint-disable-next-line consistent-return
        async load(id) {
            if (id === resolvedVRuntimeConfig) {
                const runtimeConfig: RuntimeConfig = {
                    basePath: config.basePath,
                    server: config.server,
                    appConfig: config.appConfig,
                };

                return `export const runtimeConfig = ${JSON.stringify(runtimeConfig)}`;
            } if (id === resolvedVFallbackFn) {
                if (!fs.existsSync(id)) {
                    return 'export default () => {}';
                }
            } if (id === resolvedVAppConfig) {
                return `export const appConfig = ${JSON.stringify(config.appConfig)}`;
            } if (id === resolvedVServerMiddlewareImports) {
                let imports = '';

                config.server.middleware.forEach(({ handler }) => {
                    imports += `'${handler}': () => import('${handler}'),`;
                });

                return `export const serverMiddlewareImports = {${imports}}`;
            } if (id === resolvedVServerPluginImports) {
                const imports: string[] = [];

                config.server.plugins.forEach((handler) => {
                    imports.push(`() => import('${handler}')`);
                });

                return `export const serverPluginImports = [${imports.join(',')}]`;
            }
        },
        async writeBundle() {
            if (pluginConfig.target === 'client' && viteCommand === 'build') {
                if (fs.existsSync(pluginConfig.srcPublicFullPath)) {
                    try {
                        await copyFiles(
                            [pluginConfig.srcPublicFullPath + '/**/*'],
                            pluginConfig.outPublicFullPath,
                        );
                    } catch (err) {
                        console.error('[flue3] filed to copy public dir', err);
                    }
                }

                if (fs.existsSync(pluginConfig.outAssetsDirFullPath)) {
                    await fs.move(
                        pluginConfig.outAssetsDirFullPath,
                        path.join(pluginConfig.outPublicFullPath, pluginConfig.outAssetsDir),
                        {
                            overwrite: true,
                        },
                    );
                }
            }
        },
        async closeBundle() {
            if (isVHtml) {
                if (fs.existsSync(pluginConfig.vHtmlPath)) {
                    try {
                        await fs.rm(pluginConfig.vHtmlPath, {
                            recursive: true,
                        });
                    } catch {}
                }
            }

            const manifestPath = path.join(pluginConfig.outDirFullPath, 'manifest.json');
            const ssrManifestPath = path.join(pluginConfig.outDirFullPath, 'ssr-manifest.json');

            if (fs.existsSync(manifestPath) && fs.existsSync(ssrManifestPath)) {
                const manifest: Manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
                const ssrManifest: SSRManifest = JSON.parse(fs.readFileSync(ssrManifestPath, 'utf-8'));

                ssrManifestImplementCssImportsCollision(ssrManifest, manifest, pluginConfig.basePath);

                fs.writeFileSync(ssrManifestPath, JSON.stringify(ssrManifest), {
                    encoding: 'utf-8',
                });
            }
        },
    };
};
