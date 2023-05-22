import {
    createRouter,
    createWebHistory,
    createMemoryHistory,
    RouteLocationNormalizedLoaded,
} from 'vue-router';
import { definePlugin, AppContext } from 'flue3';
import { pluginRoutes } from './routes/pluginRoutes.js';
import {
    reactive,
    computed,
    unref,
} from 'vue';
import { createErrorStateMiddleware } from './middleware/createErrorStateMiddleware.js';
import { createRoutesMiddleware } from './middleware/createRoutesMiddleware.js';
import {
    LayoutComponentsRecord,
    RouteRecord,
    RouterPluginOptions,
} from './types.js';
import { proceedUncertainModuleFunc } from 'flue3/lib/utils/proceedUncertainModuleFunc.js';
import { parseRoutesRecordToRaw } from './utils.js';

export const createRouterPlugin = definePlugin(async (
    {
        appContext,
        inject,
    },
    options: RouterPluginOptions,
) => {
    const routes = await proceedUncertainModuleFunc<
    RouteRecord[], AppContext
    >(options.routes, appContext);
    const layouts = await proceedUncertainModuleFunc<
    LayoutComponentsRecord | undefined, AppContext
    >(options.layouts, appContext);

    const router = createRouter({
        routes: [...parseRoutesRecordToRaw(routes), ...pluginRoutes],
        scrollBehavior: options.scrollBehavior,
        history: appContext.isServer
            ? createMemoryHistory(appContext.basePath) : createWebHistory(appContext.basePath),
    });

    inject('router', router);
    inject('layouts', layouts || {});
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

    appContext.hooks.hook('entry:after', async () => {
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
export { default as ChildView } from './components/ChildView.js';
