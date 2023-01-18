import { Plugin } from 'vite';
import fs from 'fs';
import fsp from 'fs/promises';
import { resolveHtmlTemplate } from '../htmlTemplate/resolveHtmlTemplate.js';
import { Config } from '../types/Config.js';
import { RuntimeConfig } from '../types/RuntimeConfig.js';
import { copyFiles } from '../utils/copyFiles.js';
import path from 'path';
import { APP_PATH } from '../constants/constants.js';

export const frameworkVitePlugin = (config: Config, pluginConfig: {
    target: 'server' | 'client';
    srcFullPath: string;
    appEntryFullPath: string;
    appEntryClientFullPath: string;
    appEntryServerFullPath: string;
    vHtmlPath: string;
    srcPublicFullPath: string;
    outPublicFullPath: string;
}): Plugin => {
    const vRuntimeConfig = 'virtual:flue3RuntimeConfig';
    const vFallbackFn = 'virtual:flue3FnFallback';
    const resolvedVRuntimeConfig = '\0' + vRuntimeConfig;
    const resolvedVFallbackFn = '\0' + vFallbackFn;

    let viteCommand: 'build' | 'serve' = 'build';
    let isVHtml = false;

    return {
        name: 'flue3',
        async config(viteConfig, { command }) {
            viteCommand = command;

            if (viteCommand === 'build') {
                if (!fs.existsSync(pluginConfig.vHtmlPath)) {
                    isVHtml = true;
                    await fsp.writeFile(pluginConfig.vHtmlPath, resolveHtmlTemplate(config));
                }
            }
        },
        // eslint-disable-next-line consistent-return
        async resolveId(id, importer, resolveOptions) {
            const resolveUniversalEntrypointPath = (ssr = false) => {
                return path.join(APP_PATH, ssr ? 'entryServer' : 'entryClient');
            };
            const resolveAppTargetEntrypointPath = (ssr = false) => {
                const entryFilePath = ssr ? pluginConfig.appEntryServerFullPath : pluginConfig.appEntryClientFullPath;
                return entryFilePath;
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

            if (id === vRuntimeConfig) {
                return resolvedVRuntimeConfig;
            }
        },
        // eslint-disable-next-line consistent-return
        load(id) {
            if (id === resolvedVRuntimeConfig) {
                const runtimeConfig: RuntimeConfig = {
                    server: config.server,
                };

                return `export const runtimeConfig = ${JSON.stringify(runtimeConfig)}`;
            } if (id === resolvedVFallbackFn) {
                if (!fs.existsSync(id)) {
                    return 'export default () => {}';
                }
            }
        },
        async writeBundle() {
            if (pluginConfig.target === 'client') {
                if (viteCommand === 'build') {
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
                }
            }
        },
        async buildEnd() {
            if (isVHtml) {
                if (fs.existsSync(pluginConfig.vHtmlPath)) {
                    try {
                        await fsp.rm(pluginConfig.vHtmlPath, {
                            recursive: true,
                        });
                    } catch {}
                }
            }
        },
    };
};
