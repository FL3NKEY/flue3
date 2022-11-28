import { h } from 'vue';
import { defineLayoutComponent } from '../defines/defineLayoutComponent.js';

export default defineLayoutComponent({
    name: 'DefaultLayout',
    setup(props, { slots }) {
        const Root = (_: any) => h('div', {}, _);
        const Default = () => (slots.default ? slots.default() : null);

        return () => Root(Default());
    },
});
