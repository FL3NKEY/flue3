import { AppContext } from './AppContext.js';
import { SSRContext } from './SSRContext.js';

export interface FrameworkContext {
    appContext: AppContext;
    ssrContext: SSRContext;
}
