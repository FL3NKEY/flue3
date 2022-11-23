import { Config, ConfigDraft } from '../types/Config.js';
import { defaultConfig } from './defaultConfig.js';
import { resolveUserConfig } from './resolveUserConfig.js';
import { mergeConfig } from './mergeConfig.js';

let cachedConfig: Config;

export const resolveConfig = (overwrites?: ConfigDraft): Config => {
    if (!cachedConfig) {
        cachedConfig = mergeConfig(defaultConfig, resolveUserConfig());
    }

    return overwrites ? mergeConfig(cachedConfig, overwrites) : cachedConfig;
};
