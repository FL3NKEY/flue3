import { SSRContext } from '../../types/SSRContext.js';

export const createSSRContext = (): SSRContext => {
    return {
        teleports: {},
        modules: new Set(),
    };
};
