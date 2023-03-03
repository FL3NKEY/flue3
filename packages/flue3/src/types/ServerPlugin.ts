import { AppContext } from './AppContext.js';

export type ServerPlugin = (appContext: AppContext) => void;
