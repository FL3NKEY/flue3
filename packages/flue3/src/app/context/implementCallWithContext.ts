import { AppContext } from '../../types/AppContext.js';
import { callWithAppContext } from './callWithAppContext.js';

export const implementCallWithContext = (appContext: AppContext) => {
    appContext.inject(
        'callWithContext',
        (fn) => callWithAppContext(appContext, fn),
        true,
    );
};
