import { useAsyncData } from './useAsyncData.js';
import {
    AsyncDataHandler,
    AsyncDataOptions,
    AsyncDataReturnBody,
} from '../../types/AsyncData.js';

export const useLazyAsyncData = <T>(
    key: string,
    handler: AsyncDataHandler<T>,
    options?: AsyncDataOptions<T> & { lazy: true },
): AsyncDataReturnBody<T> => {
    return useAsyncData<T>(key, handler, {
        lazy: true,
        ...(options ?? {}),
    });
};
