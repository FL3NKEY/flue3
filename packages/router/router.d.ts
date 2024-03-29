import { Router, RouteLocationNormalized } from 'vue-router';
import { LayoutComponentsRecord } from './src/types.js';

declare module 'flue3' {
    interface AppContext {
        router: Router;
        route: RouteLocationNormalized;
        layouts: LayoutComponentsRecord;
    }
}
