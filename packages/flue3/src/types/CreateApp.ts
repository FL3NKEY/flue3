import { FrameworkContext } from './FrameworkContext.js';

export type CreateApp = (context: FrameworkContext) => Promise<void> | void;
