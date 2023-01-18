import path from 'path';
import url from 'url';

export const DIRNAME = url.fileURLToPath(new URL('.', import.meta.url));
export const WORKDIR = process.cwd();
export const USER_CONFIG_FILENAMES = [
    'flue3.config.js',
    'flue3.config.ts',
    'flue3.config.mjs',
];
export const APP_PATH = path.join(DIRNAME, '../app');
export const TEMPLATES_PATH = path.join(DIRNAME, '../../templates');
export const UNIVERSAL_ENTRY_PATH = path.join(DIRNAME, '../universalEntry');
