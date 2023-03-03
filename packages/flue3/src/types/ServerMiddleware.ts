import { EventHandler } from 'h3';
import { Config } from './Config.js';

export type ServerMiddleware = (appConfig: Config['appConfig']) => EventHandler;

export interface ServerMiddlewareRecord {
    path: string;
    handler: EventHandler;
}
