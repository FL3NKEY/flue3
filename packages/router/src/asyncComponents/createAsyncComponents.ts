import {
    AppContext,
    PageComponent,
    BaseComponent,
} from '../types.js';

export const createAsyncComponents = (appContext: AppContext) => {
    appContext.router.beforeResolve(async (to, from, next) => {
        const loadAndImplementAsyncComponents = async (baseComponent: BaseComponent) => {
            if (!baseComponent.asyncComponents) {
                return;
            }

            const asyncComponentsResult = await baseComponent.asyncComponents({
                appContext,
                redirect: appContext.redirect,
                error: appContext.error,
                route: to,
                fromRoute: from,
            });

            if (!asyncComponentsResult) {
                return;
            }

            // eslint-disable-next-line no-param-reassign
            baseComponent.components ??= {};

            // eslint-disable-next-line guard-for-in,no-restricted-syntax
            for (const key in asyncComponentsResult) {
                const asyncComponentKey = key as keyof typeof asyncComponentsResult;
                let asyncComponent = asyncComponentsResult[asyncComponentKey];

                if (typeof asyncComponentsResult[asyncComponentKey] === 'function') {
                    /* todo fix typing */
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    const loadedAsyncComponent = await asyncComponentsResult[asyncComponentKey]();
                    asyncComponent = loadedAsyncComponent.default ?? loadedAsyncComponent;
                }

                // eslint-disable-next-line no-param-reassign
                baseComponent.components[key] = asyncComponent;
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

            const pageComponent: PageComponent = matched.components?.default ?? matched.components ?? {};
            await loadAndImplementAsyncComponents(pageComponent);
        }

        if (!appContext.isRedirected() && to.meta.routerLayoutName) {
            const layoutComponent = (await appContext.resolveLayoutComponent(to.meta.routerLayoutName as string)) ?? {};
            await loadAndImplementAsyncComponents(layoutComponent);
        }

        return next();
    });
};
