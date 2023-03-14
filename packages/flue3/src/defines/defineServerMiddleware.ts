import { ServerMiddleware } from '../types/ServerMiddleware.js';
import {
    eventHandler,
    fromNodeMiddleware,
    NodeMiddleware,
} from 'h3';

export const defineServerMiddleware = (
    serverMiddleware: ServerMiddleware,
) => eventHandler(serverMiddleware);

export const defineServerNodeMiddleware = (
    serverMiddleware: NodeMiddleware,
) => fromNodeMiddleware(serverMiddleware);
