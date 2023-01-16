import {
    defineComponent,
    onMounted,
    ref,
    unref,
} from 'vue';

export default defineComponent({
    name: 'ClientOnly',
    setup(props, { slots }) {
        const isMounted = ref(false);

        onMounted(() => {
            isMounted.value = true;
        });

        const Default = () => {
            return slots.default ? slots.default() : undefined;
        };

        const Fallback = () => {
            return slots.fallback ? slots.fallback() : undefined;
        };

        return () => unref(isMounted) ? Default() : Fallback();
    },
});
