import { AppContext } from 'flue3';
import { AppMiddleware } from 'flue3/src/types/AppMiddleware.js';

export const createRoutesMiddleware = (appContext: AppContext) => {
    appContext.router.beforeResolve(async (to, from, next) => {
        if (!appContext.errorState.captured || !to.meta.middleware) {
            return next();
        }

        const routeMiddleware = to.meta.middleware as AppMiddleware | AppMiddleware[];
        const middlewares: AppMiddleware[] = !Array.isArray(routeMiddleware) ? [routeMiddleware] : routeMiddleware;

        // eslint-disable-next-line no-restricted-syntax
        for (const middleware of middlewares) {
            if (appContext.isRedirected() || appContext.errorState.status > 0) {
                break;
            }

            await appContext.callWithContext(() => middleware(appContext));
        }

        next();
    });
};
