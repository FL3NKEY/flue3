import {
    ref,
    watch,
    Ref,
    UnwrapRef,
    onBeforeUnmount,
} from 'vue';
import { useAppContext } from './useAppContext.js';

export const useState = <T>(key: string, initialValue?: () => T): Ref<T> => {
    const stateKey = key;
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

    const unregisterStateHook = appContext.hooks.hook(
        'state:changed',
        (key, data: UnwrapRef<T>) => {
            if (key === stateKey && refValue.value !== data) {
                refValue.value = data;
            }
        },
    );

    onBeforeUnmount(() => {
        unregisterStateHook();
    });

    watch(refValue, (newValue) => {
        appContext.writeState(stateKey, newValue);
    }, {
        deep: true,
    });

    return refValue as Ref<T>;
};
