import {
    ref,
    watch,
    Ref,
} from 'vue';
import { useAppContext } from './useAppContext.js';

export const useState = <T>(key: string, initialValue?: () => T) => {
    const {
        state,
        writeState,
    } = useAppContext();

    let initialRefValue: T;

    if (state.hasOwnProperty(key)) {
        initialRefValue = state[key];
    } else if (initialValue) {
        initialRefValue = initialValue();
        writeState(key, initialRefValue);
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const refValue = ref<T>(initialRefValue!);

    watch(refValue, (newValue) => {
        writeState(key, newValue);
    }, {
        deep: true,
    });

    return refValue as Ref<T>;
};
