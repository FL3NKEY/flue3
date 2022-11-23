export function defer(): {
    status: string;
    promise: Promise<any>;
    resolve: (value: any) => void;
    reject: (error: any) => void;
} {
    const deferred = {
        status: 'pending',
    } as Record<any, any>;
    deferred.promise = new Promise((resolve, reject) => {
        deferred.resolve = (value: any) => {
            deferred.status = 'resolved';
            return resolve(value);
        };
        deferred.reject = (error: any) => {
            deferred.status = 'rejected';
            return reject(error);
        };
    });
    return deferred as ReturnType<typeof defer>;
}
