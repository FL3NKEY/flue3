import { defineComponent } from 'vue';
import { RouteRecordRaw } from 'vue-router';
import { useError } from 'flue3';

export const pluginRoutes: RouteRecordRaw[] = [{
    path: '/:matchAll(.*)',
    component: defineComponent({
        setup() {
            const { error } = useError();
            error(404);
        },
    }),
}];
