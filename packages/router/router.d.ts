import { Router, RouteLocationNormalized } from 'vue-router';
import { Layout, LayoutComponent } from './src/types.js';

declare module 'flue3/lib/types/AppContext.js' {
    interface AppContext {
        router: Router;
        route: RouteLocationNormalized;
        clientRedirect: Router['push'];
        layouts: Record<string, Layout>;
        resolvedLayouts: Record<string, LayoutComponent>;
        resolveLayout: (layoutName: string) => Promise<boolean>;
        resolveLayoutComponent: (layoutName: string) => Promise<LayoutComponent | undefined>;
    }
}
