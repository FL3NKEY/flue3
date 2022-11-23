import { AppContext } from '../../types/AppContext';
import { clientExternalRedirect } from '../../utils/clientExternalRedirect.js';

export const implementAppRedirect = (appContext: AppContext) => {
    const redirect = (location: string, status = 302) => {
        if (appContext.isServer) {
            appContext.writeResponse({
                status,
                headers: { location },
            });
        } else if (location.startsWith('/')) {
            appContext.clientRedirect(location);
        } else {
            clientExternalRedirect(location);
        }
    };

    // eslint-disable-next-line no-param-reassign
    appContext.redirect = redirect;

    return redirect;
};
