import {
    ref,
    watch,
    Ref,
} from 'vue';
import { useAppContext } from './useAppContext.js';

export const getStateKey = (key: string) => `$state.${key}`;

export const useState = <T>(key: string, initialValue?: () => T): Ref<T> => {
    const stateKey = getStateKey(key);
    const appContext = useAppContext();

    let initialRefValue: T;

    if (appContext.state.hasOwnProperty(stateKey)) {
        initialRefValue = appContext.state[stateKey];
    } else if (initialValue) {
        initialRefValue = initialValue();
        appContext.writeState(stateKey, initialRefValue);
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const refValue = ref<T>(initialRefValue!);

    watch(refValue, (newValue) => {
        appContext.writeState(stateKey, newValue);
    }, {
        deep: true,
    });

    return refValue as Ref<T>;
};
