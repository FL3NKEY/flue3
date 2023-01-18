import {
    createRouter,
    createWebHistory,
    createMemoryHistory,
    RouteLocationNormalizedLoaded,
    RouteRecordRaw,
} from 'vue-router';
import { definePlugin } from 'flue3';
import { pluginRoutes } from './routes/pluginRoutes.js';
import {
    reactive,
    computed,
    unref,
} from 'vue';
import { createErrorStateMiddleware } from './middleware/createErrorStateMiddleware.js';
import { createRoutesMiddleware } from './middleware/createRoutesMiddleware.js';
import { LayoutComponentsRecord, RouterPluginOptions } from './types.js';
import { proceedUncertainModuleFunc } from 'flue3/lib/utils/proceedUncertainModuleFunc.js';
import { AppContext } from 'flue3/lib/types/AppContext.js';

export const createRouterPlugin = definePlugin(async (
    {
        appContext,
        inject,
        onAfterEntry,
    },
    options: RouterPluginOptions,
) => {
    const routes = await proceedUncertainModuleFunc<
    RouteRecordRaw[], AppContext
    >(options.routes, appContext);
    const layouts = await proceedUncertainModuleFunc<
    LayoutComponentsRecord | undefined, AppContext
    >(options.layouts, appContext);

    const router = createRouter({
        routes: [...routes, ...pluginRoutes],
        scrollBehavior: options.scrollBehavior,
        history: appContext.isServer ? createMemoryHistory() : createWebHistory(),
    });

    inject('router', router);
    inject('layouts', layouts);
    inject('clientRedirect', router.push, true);

    const reactiveRoute: any = {};
    [
        'fullPath',
        'hash',
        'href',
        'matched',
        'meta',
        'name',
        'params',
        'path',
        'query',
        'redirectedFrom',
    ].forEach(
        (key) => {
            reactiveRoute[key] = computed(
                () => unref(router.currentRoute)[key as keyof RouteLocationNormalizedLoaded],
            );
        },
    );

    inject('route', reactive(reactiveRoute));

    appContext.vueApp.use(router);

    createErrorStateMiddleware(appContext);

    onAfterEntry(async () => {
        createRoutesMiddleware(appContext);

        if (appContext.isServer) {
            await router.push(appContext?.req?.url ?? '/');
        }

        await router.isReady();
    });
});

export * from 'vue-router';
export { defineRoutes } from './defines/defineRoutes.js';
export { defineLayouts } from './defines/defineLayouts.js';
export { default as RootView } from './components/RootView.js';
