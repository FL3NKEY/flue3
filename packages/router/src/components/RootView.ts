import {
    defineComponent,
    h,
    unref,
} from 'vue';
import { RouterView } from 'vue-router';
import { useLayout } from '../composables/useLayout.js';

export default defineComponent({
    name: 'RootView',
    setup() {
        const { layoutComponent } = useLayout();

        return () => h(unref(layoutComponent), () => h(RouterView));
    },
});
