import {
    defineComponent,
    Suspense,
    h,
    Component,
    VNode,
    unref,
} from 'vue';
import { RouterView } from 'vue-router';
import { useLayout } from '../composables/useLayout.js';
import LayoutResolver from './LayoutResolver.js';

export default defineComponent({
    name: 'RootView',
    setup() {
        const { layoutName } = useLayout();

        const Layout = (_?: VNode) => {
            return h(LayoutResolver, {
                key: unref(layoutName),
                name: unref(layoutName),
            }, () => _);
        };

        const Root = () => {
            return h(RouterView, ({ Component: ViewComponent }: { Component: Component }) => {
                return h(Suspense, () => Layout(h(Suspense, () => h(ViewComponent))));
            });
        };

        return () => Root();
    },
});
