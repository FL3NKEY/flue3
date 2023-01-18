export const proceedUncertainModuleFunc = async <T, C>(
    module: ((arg: C) => T | Promise<T | { default: T }>) | T,
    arg?: C,
): Promise<T> => {
    if (typeof module === 'function') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const calledModule = await module(arg);

        if (Object.prototype.toString.call(calledModule) === '[object Module]') {
            return calledModule.default;
        }

        return calledModule;
    }

    return module;
};
