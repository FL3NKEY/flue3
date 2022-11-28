import {
    onServerPrefetch,
    onUnmounted,
    ref,
    unref,
    computed,
    Ref,
    ComputedRef,
} from 'vue';
import { useAppContext } from './useAppContext.js';
import { useState } from './useState.js';
import { AppContext } from '../../types/AppContext.js';
import { serializeError } from 'serialize-error';
import { FetchState } from '../../types/FetchState.js';

export const useFetch = <T>(
    key: string,
    hook: (appContext: AppContext) => Promise<T> | T,
    initialValue?: () => T,
    {
        serverPrefetch = true,
        initialFetch = true,
    }: {
        serverPrefetch?: boolean;
        initialFetch?: boolean;
    } = {},
) => {
    const fetchKey = `_fetch.${key}`;
    const refFn = <TR>(initialState: () => TR) => (
        serverPrefetch
        ? useState<TR>(key, initialState)
        : ref<TR>(initialState())
    ) as Ref<TR>;

    const appContext = useAppContext();
    const fetchState = refFn<FetchState<T>>(() => ({
        serverPrefetched: false,
        data: initialValue ? initialValue() : undefined as T,
        pending: false,
        error: undefined,
    }));

    const data = computed(() => unref(fetchState).data);
    const pending = computed(() => unref(fetchState).pending);
    const error = computed(() => unref(fetchState).error);

    const fetch = async () => {
        if (unref(fetchState).pending) {
            return;
        }

        try {
            fetchState.value.pending = true;
            fetchState.value.data = await hook(appContext);
            fetchState.value.error = undefined;
        } catch (err) {
            fetchState.value.error = serializeError(err);
        } finally {
            fetchState.value.pending = false;
        }
    };

    if (initialFetch) {
        if (appContext.isServer && serverPrefetch) {
            onServerPrefetch(fetch);
            fetchState.value.serverPrefetched = true;
        }

        if (appContext.isClient && !unref(fetchState).serverPrefetched) {
            fetch();
        }
    }

    onUnmounted(() => {
        delete appContext.state[fetchKey];
    });

    return {
        data,
        pending,
        error,
        fetch,
    } as {
        data: ComputedRef<T>;
        pending: ComputedRef<boolean>;
        error: ComputedRef<unknown>;
        fetch: typeof fetch;
    };
};
