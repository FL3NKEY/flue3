import { defineComponent } from 'vue';
import { defineMiddlewares } from '../defines/defineMiddlewares';
import { RouteRecordRaw } from 'vue-router';

export const defaultRoutes: RouteRecordRaw[] = [{
    path: '/:matchAll(.*)',
    component: defineComponent({
        render() {
            return this.$slots.default ? this.$slots.default() : null;
        },
    }),
    meta: {
        middlewares: defineMiddlewares(
            [({ appContext, error }) => {
                if (appContext.errorState.status <= 0) {
                    error(404);
                }
            }],
        ),
    },
}];
