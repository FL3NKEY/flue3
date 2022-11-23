import path from 'path';
import url from 'url';

export const DIRNAME = url.fileURLToPath(new URL('.', import.meta.url));
export const WORKDIR = process.cwd();
export const USER_CONFIG_FILENAME = 'flue3.config.js';
export const APP_PATH = path.join(DIRNAME, '../app');
export const TEAMPLATES_PATH = path.join(DIRNAME, '../../templates');
