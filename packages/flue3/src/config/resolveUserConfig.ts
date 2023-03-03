import { ConfigDraft } from '../types/Config.js';
import {
    WORKDIR,
    USER_CONFIG_FILENAMES,
    APP_PATH,
    UNIVERSAL_ENTRY_PATH,
} from '../constants/constants.js';
import path from 'path';
import fs from 'fs-extra';
import { createRequire } from 'module';
import esAliasPlugin from 'esbuild-plugin-alias';
import { loadEnv } from 'vite';
import * as process from 'process';

let userConfigCache: ConfigDraft;

export const resolveUserConfig = async (): Promise<ConfigDraft> => {
    if (userConfigCache) {
        return userConfigCache;
    }

    let foundedUserConfigFilePath = '';
    // eslint-disable-next-line no-restricted-syntax
    for (const userConfigFilename of USER_CONFIG_FILENAMES) {
        if (fs.existsSync(path.join(WORKDIR, userConfigFilename))) {
            foundedUserConfigFilePath = userConfigFilename;
            break;
        }
    }

    if (!foundedUserConfigFilePath) {
        return {};
    }

    const { build: esBuild } = await import('esbuild');
    const env = loadEnv(process.env.NODE_ENV || 'production', WORKDIR, 'APP_');

    const esResult = await esBuild({
        absWorkingDir: WORKDIR,
        entryPoints: [foundedUserConfigFilePath],
        write: false,
        bundle: true,
        target: ['node16'],
        platform: 'node',
        mainFields: ['main'],
        format: 'cjs',
        plugins: [esAliasPlugin({
            '#_FLUE3_UNIVERSAL_ENTRY': path.join(APP_PATH, 'entryClient.js'),
            '#_FLUE3_APP_TARGET_ENTRY': path.join(UNIVERSAL_ENTRY_PATH, 'universalEntry.js'),
            'virtual:flue3AppConfig': path.join(APP_PATH, 'config/appConfig.js'),
        })],
        define: {
            'import.meta.env': JSON.stringify({
                ...env,
                DEV: process.env.NODE_ENV === 'development',
                PROD: process.env.NODE_ENV !== 'development',
            }),
        },
    });

    if (!esResult.outputFiles?.[0]) {
        return {};
    }

    const { text: userConfigSource } = esResult.outputFiles[0];
    const userConfigFilename = `flue3.config.timestamp-${Date.now()}.js`;
    const userConfigFullPath = path.join(WORKDIR, `${userConfigFilename}.js`);
    fs.writeFileSync(userConfigFullPath, userConfigSource);

    try {
        const dynamicRequire = createRequire(import.meta.url);
        userConfigCache = (await dynamicRequire(userConfigFullPath)).default;
    } catch (err) {
        console.error('[flue3] failed to parse config file', err);
    } finally {
        try {
            fs.unlinkSync(userConfigFullPath);
        } catch {}
    }

    return userConfigCache;
};
