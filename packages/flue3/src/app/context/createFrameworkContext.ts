import { AppContext } from '../../types/AppContext.js';
import { FrameworkContext } from '../../types/FrameworkContext.js';

export const createFrameworkContext = (appContext: AppContext): FrameworkContext => {
    return {
        appContext,
        ssrContext: {
            teleports: {},
            modules: new Set(),
        },
    };
};
