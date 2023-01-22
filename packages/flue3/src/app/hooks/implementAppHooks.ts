import { createHooks } from 'hookable';
import { AppContext } from '../../types/AppContext.js';
import { AppHooks } from '../../types/AppHooks.js';

export const implementAppHooks = (appContext: AppContext) => {
    const hooks = createHooks<AppHooks>();
    appContext.inject('hooks', hooks, true);
};
