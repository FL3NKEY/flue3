import { FrameworkContext } from '../../types/FrameworkContext.js';
import { AppContext } from '../../types/AppContext.js';
import { SSRContext } from '../../types/SSRContext.js';

export const createFrameworkContext = (): FrameworkContext => {
    return {
        appContext: {} as AppContext,
        ssrContext: {} as SSRContext,
    };
};
