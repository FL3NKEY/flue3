import { ConfigDraft } from '../types/Config.js';
import { WORKDIR, USER_CONFIG_FILENAME } from '../constants/constants.js';
import path from 'path';
import fs from 'fs';

let userConfigCache: ConfigDraft;

export const userConfigFilePath = path.join(WORKDIR, USER_CONFIG_FILENAME);
export const resolveUserConfig = (): ConfigDraft => {
    if (!fs.existsSync(userConfigFilePath)) {
        return {};
    }

    if (!userConfigCache) {
        userConfigCache = require(userConfigFilePath);
    }

    return userConfigCache;
};
