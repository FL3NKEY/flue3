import { defer } from '../../utils/defer.js';
import { isRedirect } from '../../utils/isRedirect.js';
import { AppContext } from '../../types/AppContext.js';
import { AppResponse, AppWriteResponse } from '../../types/AppResponse.js';

export const createAndImplementServerResponse = (appContext: AppContext) => {
    const deferred = defer();
    let response: AppResponse = {
        headers: {},
    };

    const writeResponse: AppWriteResponse = (params) => {
        response = {
            ...params,
            headers: {
                ...response.headers,
                ...(params.headers || {}),
            },
        };

        if (isRedirect(params.status)) {
            deferred.resolve(response);
        }
    };

    const isRedirected = () => isRedirect(response.status);

    appContext.inject('response', response);
    appContext.inject('writeResponse', writeResponse);
    appContext.inject('isRedirected', isRedirected);

    return {
        deferred,
        response,
        writeResponse,
        isRedirected,
    };
};
