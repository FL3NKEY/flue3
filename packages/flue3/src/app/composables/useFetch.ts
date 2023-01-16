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

type FetchHook<T> = (appContext: AppContext) => Promise<T> | T;
type loadFn = () => Promise<void>;

interface FetchOptions<T> {
    lazy?: boolean;
    initialFetch?: boolean;
    initialValue?: () => T;
}

interface FetchState<T> {
    serverPrefetched: boolean;
    data: T;
    pending: boolean;
    error: unknown;
}

interface FetchReturnBody<T> {
    data: Ref<T>;
    pending: ComputedRef<boolean>;
    error: ComputedRef<unknown>;
    load: loadFn;
    refresh: loadFn;
}

type FetchReturn<T> = Promise<FetchReturnBody<T>> | FetchReturnBody<T>;

export const getFetchStateKey = (key: string) => `$fetch.${key}`;

export function useFetch <T>(
    key: string,
    hook: FetchHook<T>,
    options?: FetchOptions<T>,
): FetchReturn<T> {
    const isLazy = options?.lazy ?? false;
    const initialFetch = options?.initialFetch ?? true;
    const initialValue = options?.initialValue;

    const fetchKey = getFetchStateKey(key);
    const appContext = useAppContext();

    let initialState: FetchState<T> = {
        serverPrefetched: false,
        data: undefined as T,
        pending: initialFetch,
        error: undefined,
    };

    if (appContext.isClient) {
        if (!isLazy && appContext.state.hasOwnProperty(fetchKey)) {
            initialState = appContext.state[fetchKey];
            appContext.deleteState(fetchKey);
        } else if (initialValue) {
            initialState.data = initialValue();
        }
    }

    const fetchState = reactive(initialState) as FetchState<T>;

    const data = toRef(fetchState, 'data');
    const pending = computed(() => fetchState.pending);
    const error = computed(() => fetchState.error);

    const load = async () => {
        try {
            fetchState.pending = true;
            fetchState.data = await hook(appContext);
            fetchState.error = undefined;
        } catch (err) {
            if (isAppError(err)) {
                throw err;
            }

            fetchState.error = err;
        } finally {
            fetchState.pending = false;

            if (appContext.isServer) {
                fetchState.serverPrefetched = true;
                appContext.writeState(fetchKey, toRaw({
                    ...fetchState,
                    error: serializeError(fetchState.error),
                }));
            }
        }
    };

    if (appContext.isServer) {
        watch(fetchState, (newFetchState) => {
            appContext.writeState(fetchKey, {
                ...newFetchState,
                error: serializeError(newFetchState.error),
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

    if (initialFetch) {
        if (isLazy) {
            onMounted(async () => {
                await load();
            });
        } else {
            return new Promise(async (resolve) => {
                if ((appContext.isServer && !isLazy)
                    || (appContext.isClient && !fetchState.serverPrefetched)) {
                    await load();
                }

                resolve(returns);
            });
        }
    }

    return returns;
}
