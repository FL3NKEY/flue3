import { Config, ConfigDraft } from '../types/Config.js';
import deepmerge from 'deepmerge';

export const mergeConfig = (baseConfig: Config, overwriteConfig: ConfigDraft): Config => {
    return deepmerge(baseConfig, overwriteConfig) as Config;
};
