import {
    AppContext,
    Layout,
    Layouts,
    PageComponent,
} from '../types.js';
import { findLastComponentWithProp } from '../utils.js';

export const createLayouts = (
    appContext: AppContext,
    layouts: Layouts,
) => {
    appContext.inject('layouts', layouts);

    appContext.router.beforeResolve(async (to, from, next) => {
        if (!appContext.errorState.captured) {
            return next();
        }

        const pageComponentWithLayout = findLastComponentWithProp<PageComponent>(to.matched, 'layout');

        if (!from.name && appContext.isClient) {
            // eslint-disable-next-line no-param-reassign
            to.meta.routerLayoutName = appContext.state['router.layoutName'];
            await appContext.resolveLayout(to.meta.routerLayoutName as keyof Layout);
            return next();
        }

        let layoutName = pageComponentWithLayout?.layout ?? 'default';
        if (pageComponentWithLayout && typeof pageComponentWithLayout.layout === 'function') {
            layoutName = await pageComponentWithLayout.layout({
                appContext,
                redirect: appContext.redirect,
                error: appContext.error,
                route: to,
                fromRoute: from,
            });
        }
        // eslint-disable-next-line no-param-reassign
        to.meta.routerLayoutName = layoutName;
        if (appContext.isServer) {
            appContext.writeState('router.layoutName', layoutName);
        }

        await appContext.resolveLayout(to.meta.routerLayoutName as keyof Layout);

        return next();
    });
};
