import {
    computed,
    ComputedRef,
    Ref,
    toRef,
    reactive,
    watch,
    toRaw,
    onMounted,
} from 'vue';
import { useAppContext } from './useAppContext.js';
import { AppContext } from '../../types/AppContext.js';
import { serializeError } from 'serialize-error';
import { isAppError } from '../../utils/error.js';

type AsyncDataHandler<T> = (appContext: AppContext) => Promise<T> | T;
type loadFn = () => Promise<void>;

interface AsyncDataOptions<T> {
    lazy?: boolean;
    immediate?: boolean;
    initialValue?: () => T;
}

interface AsyncDataState<T> {
    serverPrefetched: boolean;
    data: T;
    pending: boolean;
    error: unknown;
}

interface AsyncDataReturnBody<T> {
    data: Ref<T>;
    pending: ComputedRef<boolean>;
    error: ComputedRef<unknown>;
    load: loadFn;
    refresh: loadFn;
}

type AsyncDataReturn<T> = Promise<AsyncDataReturnBody<T>> | AsyncDataReturnBody<T>;

export const getAsyncDataStateKey = (key: string) => `$asyncData.${key}`;

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
            appContext.deleteState(asyncDataStateKey);
        } else if (initialValue) {
            initialState.data = initialValue();
        }
    }

    const asyncDataState = reactive(initialState) as AsyncDataState<T>;

    const data = toRef(asyncDataState, 'data');
    const pending = computed(() => asyncDataState.pending);
    const error = computed(() => asyncDataState.error);

    const load = async () => {
        try {
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
                appContext.writeState(asyncDataStateKey, toRaw({
                    ...asyncDataState,
                    error: serializeError(asyncDataState.error),
                }));
            }
        }
    };

    if (appContext.isServer) {
        watch(asyncDataState, (newState) => {
            appContext.writeState(asyncDataStateKey, {
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
        refresh: load,
    };

    if (isImmediate) {
        if (isLazy) {
            onMounted(async () => {
                await load();
            });
        } else {
            return new Promise(async (resolve) => {
                if ((appContext.isServer && !isLazy)
                    || (appContext.isClient && !asyncDataState.serverPrefetched)) {
                    await load();
                }

                resolve(returns);
            });
        }
    }

    return returns;
}
