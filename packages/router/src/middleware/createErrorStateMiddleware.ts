import { AppContext } from 'flue3';
import { START_LOCATION } from 'vue-router';

export const createErrorStateMiddleware = (appContext: AppContext) => {
    if (!appContext.isServer) {
        appContext.router.beforeEach((to, from) => {
            if (from !== START_LOCATION) {
                // eslint-disable-next-line no-param-reassign
                appContext.errorState.captured = true;
            }
        });

        appContext.router.afterEach((to, from, failure) => {
            if (appContext.errorState.captured && !failure) {
                appContext.clearError();
            }
        });
    }
};
