import { AppContext } from '../types/AppContext.js';
import { AppMiddleware } from '../types/AppMiddleware.js';

export const defineMiddleware = (
    middleware: AppMiddleware,
) => (appContext: AppContext) => middleware(appContext);
