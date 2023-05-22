import { AppContext } from '../../types/AppContext.js';

export const callWithAppContext = async (appContext: AppContext, fn: () => any): Promise<any> => {
    return appContext.vueApp.runWithContext(fn);
};
