import {
    AppContext,
    LayoutComponent,
    Layouts,
} from '../types.js';
import { reactive, markRaw } from 'vue';

export const createLayoutsResolver = (appContext: AppContext, layouts: Layouts) => {
    appContext.inject('resolvedLayouts', reactive({}));

    const resolveLayoutComponent = async (layoutName = 'default') => {
        if (appContext.resolvedLayouts[layoutName]) {
            return appContext.resolvedLayouts[layoutName];
        }

        const layout = layouts[layoutName];
        let layoutComponent: LayoutComponent = layout;

        if (typeof layout === 'function') {
            /* todo fix typing */
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const loadedLayoutComponent = await layout();

            layoutComponent = loadedLayoutComponent.default ?? loadedLayoutComponent;
        }

        return layoutComponent;
    };

    const resolveLayout = async (layoutName = 'default') => {
        if (!appContext.resolvedLayouts[layoutName]) {
            const layoutComponent = await resolveLayoutComponent(layoutName);

            // eslint-disable-next-line no-param-reassign
            appContext.resolvedLayouts[layoutName] = markRaw(layoutComponent);
        }

        return true;
    };

    appContext.inject('resolveLayoutComponent', resolveLayoutComponent);
    appContext.inject('resolveLayout', resolveLayout);
};
