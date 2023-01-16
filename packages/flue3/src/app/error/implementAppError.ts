import { reactive, markRaw } from 'vue';
import { AppContext } from '../../types/AppContext.js';
import { AppErrorState, AppError } from '../../types/AppError.js';
import { parseError } from '../../utils/error.js';

const errorStateKey = '$errorState';

export const implementAppError = (appContext: AppContext) => {
    let initialErrorState: AppErrorState = {
        status: 0,
        message: '',
        stack: '',
        captured: true,
    };

    if (appContext.isClient && appContext.state.hasOwnProperty(errorStateKey)) {
        initialErrorState = appContext.state[errorStateKey];
        appContext.deleteState(errorStateKey);
    }

    const errorState = reactive<AppErrorState>(initialErrorState);

    const error: AppError = (err) => {
        const {
            status, message, stack,
        } = parseError(err);

        errorState.status = status;
        errorState.message = message;
        errorState.stack = stack;
        errorState.captured = false;

        if (appContext.isServer && !appContext.isRedirected()) {
            appContext.writeResponse({
                status: status,
                statusText: message,
            });

            appContext.writeState(errorStateKey, markRaw(errorState));
        }
    };

    const clearError = () => {
        errorState.status = 0;
        errorState.message = '';
        errorState.stack = '';
        errorState.captured = true;
    };

    appContext.inject('error', error, true);
    appContext.inject('clearError', clearError, true);
    appContext.inject('errorState', errorState, true);

    return {
        error,
        errorState,
    };
};
