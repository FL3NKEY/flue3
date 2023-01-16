import { AppContext } from '../../types/AppContext.js';
import { useAppContext } from './useAppContext.js';

type Hook<T> = (context: AppContext) => Promise<T> | T;

export const useAsync = async <T>(hook: Hook<T>): Promise<T> => {
    const appContext = useAppContext();
    const result = await hook(appContext);

    return result;
};
