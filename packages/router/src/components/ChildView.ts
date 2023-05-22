import {
    defineComponent,
    Suspense,
    h,
    Component,
    unref,
} from 'vue';
import { RouterView } from 'vue-router';
import { useView, viewProps } from '../composables/useView.js';

export default defineComponent({
    name: 'ChildView',
    props: viewProps,
    setup(props) {
        const { WithTransition, key } = useView(props);

        const Root = () => {
            return h(RouterView, ({ Component: ViewComponent }: { Component: Component }) => {
                return h(Suspense, () => WithTransition(
                    h(Suspense, () => h(ViewComponent, {
                        key: unref(key),
                    })),
                ));
            });
        };

        return () => Root();
    },
});
