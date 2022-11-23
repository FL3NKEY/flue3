export const runSerial = async (promises: (() => Promise<any>)[], iterateCallback?: (result: any) => void) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const promise of promises) {
        const promiseReturns = await promise();
        if (iterateCallback) {
            iterateCallback(promiseReturns);
        }
    }
};
