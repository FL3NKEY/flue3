import { AppContext } from './AppContext.js';
import { ComputedRef, Ref } from 'vue';

export type AsyncDataHandler<T> = (appContext: AppContext) => Promise<T> | T;
type loadFn = () => Promise<void>;

export interface AsyncDataOptions<T> {
    lazy?: boolean;
    immediate?: boolean;
    initialValue?: () => T;
}

export interface AsyncDataState<T> {
    serverPrefetched: boolean;
    data: T;
    pending: boolean;
    error: unknown;
}

export interface AsyncDataReturnBody<T> {
    data: Ref<T>;
    pending: ComputedRef<boolean>;
    error: ComputedRef<unknown>;
    load: loadFn;
    refresh: loadFn;
}

export type AsyncDataReturn<T> = AsyncDataReturnBody<T> | Promise<AsyncDataReturnBody<T>>;
