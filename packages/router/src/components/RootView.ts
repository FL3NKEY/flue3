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
import { useView, viewProps } from '../composables/useView.js';

export default defineComponent({
    name: 'RootView',
    props: viewProps,
    setup(props) {
        const { layoutName } = useLayout();
        const { WithTransition, key } = useView(props);

        const Layout = (_?: VNode) => {
            return h(LayoutResolver, {
                key: unref(layoutName),
                name: unref(layoutName),
            }, () => _);
        };

        const Root = () => {
            return h(RouterView, ({ Component: ViewComponent }: { Component: Component }) => {
                return h(Suspense, () => Layout(
                    WithTransition(
                        h(Suspense, () => h(ViewComponent, {
                            key: unref(key),
                        })),
                    ),
                ));
            });
        };

        return () => Root();
    },
});
