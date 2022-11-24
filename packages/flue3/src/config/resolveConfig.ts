import { Config, ConfigDraft } from '../types/Config.js';
import { defaultConfig } from './defaultConfig.js';
import { resolveUserConfig } from './resolveUserConfig.js';
import { mergeConfig } from './mergeConfig.js';

let cachedConfig: Config;

export const resolveConfig = async (overwrites?: ConfigDraft): Promise<Config> => {
    const userConfig = await resolveUserConfig();

    if (!cachedConfig) {
        cachedConfig = mergeConfig(defaultConfig, userConfig);
    }

    return overwrites ? mergeConfig(cachedConfig, overwrites) : cachedConfig;
};
