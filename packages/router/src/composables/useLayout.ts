import { computed } from 'vue';
import { useRoute } from 'vue-router';

export const useLayout = () => {
    const route = useRoute();
    const layoutName = computed<string | boolean>(() => route.meta.layout as string | boolean ?? 'default');

    return {
        layoutName,
    };
};
