import { RouteRecord } from './types.js';
import { RouteRecordRaw } from 'vue-router';

export const parseRoutesRecordToRaw = (routes: RouteRecord[]): RouteRecordRaw[] => {
    const parsedRoutes: RouteRecordRaw[] = [];

    routes.forEach((route) => {
        const routeRecord = { ...route };

        if (!routeRecord.meta) {
            routeRecord.meta = {};
        }

        if (route.layout) {
            routeRecord.meta.layout = route.layout;
        }

        if (route.middleware) {
            routeRecord.meta.middleware = route.middleware;
        }

        if (route.children) {
            routeRecord.children = parseRoutesRecordToRaw(route.children);
        }

        parsedRoutes.push(routeRecord);
    });

    return parsedRoutes;
};
