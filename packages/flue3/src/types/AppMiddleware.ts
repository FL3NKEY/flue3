import { AppContext } from './AppContext.js';

export type AppMiddleware = (appContext: AppContext) => Promise<void> | void;
