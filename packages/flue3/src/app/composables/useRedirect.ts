import { useAppContext } from './useAppContext.js';

export const useRedirect = () => {
    const {
        redirect,
    } = useAppContext();

    return {
        redirect,
    };
};
