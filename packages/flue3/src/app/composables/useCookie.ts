import {
    ref,
    watch,
    Ref,
} from 'vue';
import { useAppContext } from './useAppContext.js';
import { CookieOptions, CookieValue } from '../../types/Cookie.js';

export const useCookie = <T extends CookieValue>(
    key: string,
    initialValue?: () => T,
    options?: CookieOptions,
) => {
    const {
        setCookie,
        getCookie,
        hasCookie,
    } = useAppContext();

    let initialRefValue: T;

    if (hasCookie(key)) {
        initialRefValue = getCookie(key) as T;
    } else if (initialValue) {
        initialRefValue = initialValue();
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const refValue = ref<T>(initialRefValue!);

    watch(refValue, (newValue) => {
        setCookie(key, newValue, options);
    });

    return refValue as Ref<T>;
};
