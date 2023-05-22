import { AppContext } from './AppContext.js';

export type AppInject = <KeyT extends keyof AppContext>(key: KeyT, value: AppContext[KeyT], override?: boolean) => void;
