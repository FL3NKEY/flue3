import { Component } from 'vue';
import { useAppContext } from 'flue3';
import { LayoutComponentsRecord } from '../types';

export const useLayoutResolver = async (layoutName: string | boolean) => {
    const { layouts } = useAppContext();

    let LayoutComponent: Component | null = null;

    if (layoutName) {
        const layoutComponentRaw = layouts[layoutName as keyof LayoutComponentsRecord] as any;
        let resolvedLayoutComponent: any;

        if (layoutComponentRaw) {
            resolvedLayoutComponent = layoutComponentRaw;

            if (typeof layoutComponentRaw === 'function') {
                resolvedLayoutComponent = await layoutComponentRaw().then((c: any) => c.default || c);
            }
        }

        LayoutComponent = resolvedLayoutComponent;
    }

    return {
        LayoutComponent,
    };
};
