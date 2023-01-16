import { useAppContext } from './useAppContext.js';
import { useAppContext as useAppContextInternal } from '../context/appContextProvider.js';

export const useError = () => {
    const {
        error,
        clearError,
        errorState,
    } = useAppContext();

    const { error: showError } = useAppContextInternal();

    return {
        error,
        showError,
        clearError,
        errorState,
    };
};
