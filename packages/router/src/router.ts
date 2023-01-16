import {
    createRouter,
    createWebHistory,
    createMemoryHistory,
    RouteLocationNormalizedLoaded,
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

export * from 'vue-router';

export const createRouterPlugin = definePlugin(async (
    {
        appContext,
        inject,
        onAfterEntry,
    },
    options: RouterPluginOptions,
) => {
    const router = createRouter({
        routes: [...options.routes, ...pluginRoutes],
        scrollBehavior: options.scrollBehavior,
        history: appContext.isServer ? createMemoryHistory() : createWebHistory(),
    });

    const layouts: LayoutComponentsRecord = options.layouts ?? {};

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

export { default as RootView } from './components/RootView.js';
