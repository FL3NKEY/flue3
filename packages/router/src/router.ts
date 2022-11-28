import { definePlugin } from 'flue3';
import { RouterPluginOptions } from './types.js';
import {
    createRouter,
    createWebHistory,
    createMemoryHistory,
    RouteLocationNormalizedLoaded,
} from 'vue-router';
import { defaultRoutes } from './routes/defaultRoutes.js';
import {
    reactive,
    computed,
    unref,
} from 'vue';
import { createMiddlewares } from './middlewares/createMiddlewares.js';
import { createLayoutsResolver } from './layouts/createLayoutsResolver.js';
import { createLayouts } from './layouts/createLayouts.js';
import { createAsyncData } from './asyncData/createAsyncData.js';
import { createAsyncComponents } from './asyncComponents/createAsyncComponents.js';

export const createRouterPlugin = definePlugin(
    async (
        {
            appContext,
            inject,
        },
        {
            routes,
            scrollBehavior,
            middlewares: defaultMiddlewares,
            layouts: defaultLayouts,
        }: RouterPluginOptions,
    ) => {
        const layouts = {
            default: () => import('./components/DefaultLayout.js'),
            ...(defaultLayouts ?? {}),
        };
        const router = createRouter({
            routes: [...routes, ...defaultRoutes],
            scrollBehavior,
            history: appContext.isServer ? createMemoryHistory() : createWebHistory(),
        });

        inject('router', router);
        // eslint-disable-next-line no-param-reassign
        appContext.clientRedirect = router.push;

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

        createLayoutsResolver(appContext, layouts);
        createMiddlewares(appContext, defaultMiddlewares);
        createLayouts(appContext, layouts);
        createAsyncData(appContext);
        createAsyncComponents(appContext);

        appContext.vueApp.use(router);

        if (appContext.isServer) {
            await router.push(appContext.req.url);
        }

        await router.isReady();
    },
);

export { useRoute, useRouter } from 'vue-router';
export { useLayout } from './composables/useLayout.js';
export { useAsyncData } from './composables/useAsyncData.js';
export { default as RootView } from './components/RootView.js';

export { defineMiddleware } from './defines/defineMiddleware.js';
export { defineMiddlewares } from './defines/defineMiddlewares.js';
export { definePageComponent } from './defines/definePageComponent.js';
export { defineLayoutComponent } from './defines/defineLayoutComponent.js';
