import { MiddlewareContext, Middleware } from '../types.js';

export const defineMiddleware = (
    middleware: (middlewareContext: MiddlewareContext) => Middleware,
) => (middlewareContext: MiddlewareContext) => middleware(middlewareContext);
