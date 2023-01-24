import { useAsyncData } from './useAsyncData.js';

export const useLazyAsyncData: typeof useAsyncData = (key, hook, options?) => {
    return useAsyncData(key, hook, {
        lazy: true,
        ...(options ?? {}),
    });
};
