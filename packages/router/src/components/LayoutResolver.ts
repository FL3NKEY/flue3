import {
    Component,
    defineComponent,
    h,
} from 'vue';
import { useLayoutResolver } from '../composables/useLayoutResolver.js';

export default defineComponent({
    name: 'LayoutResolver',
    props: {
        name: {
            type: [String, Boolean],
            required: true,
        },
        test: {
            type: Boolean,
        },
    },
    async setup(props, { slots }) {
        const { LayoutComponent } = await useLayoutResolver(props.name);

        if (LayoutComponent) {
            return () => h(LayoutComponent, null, slots);
        }

        return () => slots.default ? slots.default() : undefined;
    },
}) as Component;
