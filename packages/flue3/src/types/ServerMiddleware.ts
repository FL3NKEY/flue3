import { EventHandler } from 'h3';

export type ServerMiddleware = EventHandler;

export interface ServerMiddlewareRecord {
    path: string;
    handler: EventHandler;
}
