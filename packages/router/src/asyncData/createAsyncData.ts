import {
    AppContext,
    BaseComponent,
    PageComponent,
} from '../types.js';

export const createAsyncData = (appContext: AppContext) => {
    appContext.router.beforeResolve(async (to, from, next) => {
        const loadAndImplementAsyncData = async (baseComponent: BaseComponent, stateName: string) => {
            if (!baseComponent.asyncData) {
                return;
            }

            if (!from.name && appContext.isClient) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                // eslint-disable-next-line no-param-reassign
                baseComponent.asyncData.$data = appContext.state[stateName];
            } else {
                const asyncDataResult = await baseComponent.asyncData({
                    appContext,
                    redirect: appContext.redirect,
                    error: appContext.error,
                    route: to,
                    fromRoute: from,
                });
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                // eslint-disable-next-line no-param-reassign
                baseComponent.asyncData.$data = asyncDataResult;

                if (appContext.isServer) {
                    appContext.writeState(stateName, asyncDataResult);
                }
            }
        };

        if (!appContext.errorState.captured) {
            return next();
        }

        // eslint-disable-next-line no-restricted-syntax
        for (const matched of to.matched) {
            if (appContext.isRedirected() || !appContext.errorState.captured) {
                break;
            }

            const pageComponent: PageComponent | undefined = matched.components?.default;
            if (pageComponent && pageComponent?.asyncData) {
                if (matched.name) {
                    await loadAndImplementAsyncData(pageComponent, `asyncData.${String(matched.name)}`);
                } else {
                    console.error(`[@flue3/router] Route in "${matched.path}" must be named to use asyncData. Skipped.`);
                }
            }
        }

        if (!appContext.isRedirected() && to.meta.routerLayoutName) {
            const layoutComponent = (await appContext.resolveLayoutComponent(to.meta.routerLayoutName as string)) ?? {};
            await loadAndImplementAsyncData(layoutComponent, `asyncDataLayout.${to.meta.routerLayoutName}`);
        }

        return next();
    });
};
