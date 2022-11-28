import {
    AppContext,
    Middlewares,
    PageComponent,
} from '../types.js';

export const createMiddlewares = (
    appContext: AppContext,
    defaultMiddlewares: Middlewares = [],
) => {
    appContext.router.beforeResolve(async (to, from, next) => {
        if (!appContext.errorState.captured) {
            return next();
        }

        if (from.name || appContext.isServer) {
            let middlewares: Middlewares = [...defaultMiddlewares];

            if (to.meta.middlewares) {
                middlewares = [...middlewares, ...to.meta.middlewares as Middlewares];
            }

            to.matched.forEach((matched) => {
                const pageComponent = matched.components?.default as PageComponent;

                if (pageComponent?.middlewares) {
                    middlewares = [...middlewares, ...pageComponent.middlewares];
                }
            });

            // eslint-disable-next-line no-restricted-syntax
            for (const middleware of middlewares) {
                if (appContext.isRedirected() || !appContext.errorState.captured) {
                    break;
                }

                await middleware({
                    appContext,
                    redirect: appContext.redirect,
                    error: appContext.error,
                    route: to,
                    fromRoute: from,
                });
            }
        }

        return next();
    });
};
