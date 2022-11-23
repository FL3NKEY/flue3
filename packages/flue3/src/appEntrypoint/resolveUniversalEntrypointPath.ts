import path from 'path';
import { APP_PATH } from '../constants/constants.js';

export const resolveUniversalEntrypointPath = (ssr = false) => {
    return path.join(APP_PATH, ssr ? 'entryServer' : 'entryClient');
};
