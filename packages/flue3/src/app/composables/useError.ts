import { useAppContext } from './useAppContext.js';

export const useError = () => {
    const { error, errorState } = useAppContext();

    return {
        error,
        errorState,
    };
};
