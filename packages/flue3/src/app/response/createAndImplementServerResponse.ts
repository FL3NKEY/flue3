import { defer } from '../../utils/defer.js';
import { isRedirect } from '../../utils/isRedirect.js';
import { AppContext } from '../../types/AppContext.js';
import { AppResponse, AppWriteResponse } from '../../types/AppResponse.js';

export const createAndImplementServerResponse = (appContext: AppContext) => {
    const redirectDefer = defer();
    const response: AppResponse = {
        headers: {},
    };

    const writeResponse: AppWriteResponse = (params) => {
        Object.assign(response, {
            ...params,
            headers: {
                ...response.headers,
                ...(params.headers || {}),
            },
        });

        if (isRedirect(params.status)) {
            redirectDefer.resolve(response);
        }
    };

    const isRedirected = () => isRedirect(response.status);

    appContext.inject('response', response, true);
    appContext.inject('writeResponse', writeResponse, true);
    appContext.inject('isRedirected', isRedirected, true);

    return {
        redirectDefer,
        response,
        writeResponse,
        isRedirected,
    };
};
