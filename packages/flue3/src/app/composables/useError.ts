import { useAppContext } from './useAppContext.js';
import { useAppContext as useAppContextInternal } from '../context/appContextProvider.js';

export const useError = () => {
    const {
        error,
        clearError,
        errorState,
    } = useAppContext();

    const { appContext } = useAppContextInternal();

    return {
        error,
        showError: appContext.error,
        clearError,
        errorState,
    };
};
