import {
    ref,
    getCurrentInstance,
    Ref,
} from 'vue';
import { useAppContext } from 'flue3';
import { AsyncData } from '../types.js';
import { RouteLocationNormalized } from 'vue-router';

export const useAsyncData = <T>() => {
    const internalInstance = getCurrentInstance();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const asyncData: AsyncData | undefined = internalInstance?.proxy?.$options?.asyncData
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        || internalInstance?.type?.asyncData;

    if (!asyncData) {
        console.error('[@flue3/router] asyncData not found');
        return {};
    }

    const appContext = useAppContext();
    const pending = ref(false);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const data = ref<T>(asyncData.$data ?? {});

    const refresh = async () => {
        pending.value = true;
        data.value = await asyncData({
            appContext,
            redirect: appContext.redirect,
            error: appContext.error,
            route: appContext.route,
            fromRoute: {} as RouteLocationNormalized,
        });
        pending.value = false;

        /*
        if (import.meta.hot) {
            import.meta.hot.data[`${internalInstance.type.__hmrId}_asyncData`] = data.value;
        }
        */
    };

    /*
    if (import.meta.hot) {
        import.meta.hot.data[`${internalInstance.type.__hmrId}_asyncDataCreated`] = true;

        if (!import.meta.hot.data[`${internalInstance.type.__hmrId}_asyncData`]) {
            import.meta.hot.data[`${internalInstance.type.__hmrId}_asyncData`] = asyncData.__data || {};
        } else {
            data.value = import.meta.hot.data[`${internalInstance.type.__hmrId}_asyncData`];
        }

        onBeforeUnmount(() => {
            import.meta.hot.data[`${internalInstance.type.__hmrId}_asyncDataCreated`] = false;

            setTimeout(() => {
                if (!import.meta.hot.data[`${internalInstance.type.__hmrId}_asyncDataCreated`]) {
                    delete import.meta.hot.data[`${internalInstance.type.__hmrId}_asyncData`];
                }
            });
        });
    }

     */

    return {
        data,
        pending,
        refresh,
    } as {
        data: Ref<T>;
        pending: Ref<boolean>;
        refresh: () => Promise<void>;
    };
};
