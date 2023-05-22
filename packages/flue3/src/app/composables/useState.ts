import { Ref, toRef } from 'vue';
import { useAppContext } from './useAppContext.js';
import { AppState } from '../../types/AppState.js';

export const useState = <KeyT extends keyof AppState>(
    key: KeyT,
    initialValue?: () => AppState[KeyT],
): Ref<AppState[KeyT]> => {
    const stateKey = key;
    const appContext = useAppContext();

    let initialRefValue: AppState[KeyT];

    if (!appContext.state.hasOwnProperty(stateKey) && initialValue) {
        initialRefValue = initialValue();
        appContext.state[stateKey] = initialRefValue;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const refValue = toRef(appContext.state, stateKey);

    return refValue as Ref<AppState[KeyT]>;
};
