import { Plugin } from 'vite';
import fs from 'fs';
import fsp from 'fs/promises';
import { resolveHtmlTemplate } from '../htmlTemplate/resolveHtmlTemplate.js';
import { resolveUniversalEntrypointPath } from '../appEntrypoint/resolveUniversalEntrypointPath.js';
import { Config } from '../types/Config.js';
import { RuntimeConfig } from '../types/RuntimeConfig.js';
import { copyFiles } from '../utils/copyFiles.js';

export const frameworkVitePlugin = (config: Config, pluginConfig: {
    target: 'server' | 'client';
    srcFullPath: string;
    appEntryFullPath: string;
    vHtmlPath: string;
    srcPublicFullPath: string;
    outPublicFullPath: string;
}): Plugin => {
    const vRuntimeConfig = 'virtual:flue3RuntimeConfig';
    const resolvedVRuntimeConfig = '\0' + vRuntimeConfig;
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
            const aliasResolves: Record<string, string> = {
                '#_FLUE3_UNIVERSAL_ENTRY': resolveUniversalEntrypointPath(resolveOptions.ssr),
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
