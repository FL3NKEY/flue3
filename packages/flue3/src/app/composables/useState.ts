import { Ref, toRef } from 'vue';
import { useAppContext } from './useAppContext.js';
import { AppState } from '../../types/AppState.js';

type UseState = <KeyT extends keyof AppState>(
    key: KeyT,
    initialValue?: () => AppState[KeyT],
) => Ref<AppState[KeyT]>;

export const useState: UseState = (key, initialValue) => {
    const stateKey = key;
    const appContext = useAppContext();

    let initialRefValue: AppState[typeof key];

    if (!appContext.state.hasOwnProperty(stateKey) && initialValue) {
        initialRefValue = initialValue();
        appContext.state[stateKey] = initialRefValue;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const refValue = toRef(appContext.state, stateKey);

    return refValue;
};
