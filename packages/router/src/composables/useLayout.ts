import { computed } from 'vue';
import { useAppContext } from 'flue3';

export const useLayout = () => {
    const {
        resolvedLayouts, layouts, route,
    } = useAppContext();
    const layoutName = computed(() => String(route.meta.routerLayoutName) ?? 'default');
    const layoutComponent = computed(() => {
        return resolvedLayouts[layoutName.value];
    });

    return {
        layouts,
        layoutName,
        layoutComponent,
    };
};
