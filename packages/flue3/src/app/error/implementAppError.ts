import { reactive } from 'vue';
import { AppContext } from '../../types/AppContext.js';
import { AppErrorState, AppError } from '../../types/AppError.js';

export const implementAppError = (appContext: AppContext) => {
    const errorState = reactive<AppErrorState>({
        status: 0,
        message: '',
        captured: true,
    });

    const error: AppError = (options: {status: number; message?: any} | number) => {
        let status: number;
        let message: any;

        if (typeof options === 'number') {
            status = options;
        } else {
            status = options.status;
            message = options.message;
        }

        if (appContext.isServer) {
            appContext.writeResponse({
                status,
            });
        }

        errorState.status = status;
        errorState.message = message;
        errorState.captured = false;
    };

    appContext.inject('error', error);
    appContext.inject('errorState', errorState);

    return {
        error,
        errorState,
    };
};
