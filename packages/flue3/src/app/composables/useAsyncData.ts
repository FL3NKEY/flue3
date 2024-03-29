import {
    computed,
    toRef,
    reactive,
    watch,
    toRaw,
    onMounted,
} from 'vue';
import { useAppContext } from './useAppContext.js';
import { serializeError } from 'serialize-error';
import { isAppError } from '../../utils/error.js';
import {
    AsyncDataHandler,
    AsyncDataOptions,
    AsyncDataReturn,
    AsyncDataReturnBody,
    AsyncDataState,
} from '../../types/AsyncData.js';

export const getAsyncDataStateKey = (key: string) => `_asyncData.${key}`;

export function useAsyncData <T>(
    key: string,
    handler: AsyncDataHandler<T>,
    options?: AsyncDataOptions<T> & { immediate: true } | { lazy: false },
): Promise<AsyncDataReturnBody<T>>;
export function useAsyncData <T>(
    key: string,
    handler: AsyncDataHandler<T>,
    options?: AsyncDataOptions<T> & { immediate: false } | { lazy: true },
): AsyncDataReturnBody<T>;
export function useAsyncData <T>(
    key: string,
    handler: AsyncDataHandler<T>,
    options?: AsyncDataOptions<T>,
): AsyncDataReturn<T> {
    const isLazy = options?.lazy ?? false;
    const isImmediate = options?.immediate ?? true;
    const initialValue = options?.initialValue;

    const asyncDataStateKey = getAsyncDataStateKey(key);
    const appContext = useAppContext();

    let initialState: AsyncDataState<T> = {
        serverPrefetched: false,
        data: undefined as T,
        pending: isImmediate,
        error: undefined,
    };

    if (appContext.isClient) {
        if (!isLazy && appContext.state.hasOwnProperty(asyncDataStateKey)) {
            initialState = appContext.state[asyncDataStateKey];
            delete appContext.state[asyncDataStateKey];
        } else if (initialValue) {
            initialState.data = initialValue();
        }
    }

    const asyncDataState = reactive(initialState) as AsyncDataState<T>;

    const data = toRef(asyncDataState, 'data');
    const pending = computed(() => asyncDataState.pending);
    const error = computed(() => asyncDataState.error);

    const load = async (once = true) => {
        try {
            if (once && appContext.isClient && asyncDataState.serverPrefetched) {
                return;
            }

            asyncDataState.pending = true;
            asyncDataState.data = await handler(appContext);
            asyncDataState.error = undefined;
        } catch (err) {
            if (isAppError(err)) {
                throw err;
            }

            asyncDataState.error = err;
        } finally {
            asyncDataState.pending = false;

            if (appContext.isServer) {
                asyncDataState.serverPrefetched = true;
                appContext.state[asyncDataStateKey] = toRaw({
                    ...asyncDataState,
                    error: serializeError(asyncDataState.error),
                });
            }
        }
    };

    const refresh = () => load(false);

    if (appContext.isServer) {
        watch(asyncDataState, (newState) => {
            appContext.state[asyncDataStateKey] = toRaw({
                ...newState,
                error: serializeError(newState.error),
            });
        }, { deep: true });
    }

    const returns = {
        data,
        pending,
        error,
        load,
        refresh,
    };

    if (isImmediate) {
        if (isLazy) {
            onMounted(async () => {
                await load();
            });
        } else {
            return new Promise(async (resolve) => {
                await load();
                resolve(returns);
            });
        }
    }

    return returns;
}
