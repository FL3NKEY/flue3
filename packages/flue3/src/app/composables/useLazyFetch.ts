import { useFetch } from './useFetch.js';

export const useLazyFetch: typeof useFetch = (key, hook, options?) => {
    return useFetch(key, hook, {
        lazy: true,
        ...(options ?? {}),
    });
};
