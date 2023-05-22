import { Component } from 'vue';
import { RouteRecordRaw, RouterScrollBehavior } from 'vue-router';
import { AppContext } from 'flue3';
import { AppMiddleware } from 'flue3/src/types/AppMiddleware.js';

export type LayoutComponent = (() => Promise<Component | { default: Component }>) | Component;
export type LayoutComponentsRecord = Record<string, LayoutComponent>;

export type RouteRecordCustomProps = {
    layout?: string;
    middleware?: AppMiddleware | AppMiddleware[];
    children?: RouteRecord[];
};

export type RouteRecord = RouteRecordRaw & RouteRecordCustomProps;

export interface RouterPluginOptions {
    routes: (
        (
            appContext: AppContext
        ) => RouteRecord[] | Promise<RouteRecord[] | { default: RouteRecord[] }>
    ) | RouteRecord[];
    layouts?: (
        (
            appContext: AppContext
        ) => LayoutComponentsRecord | Promise<LayoutComponentsRecord | { default: LayoutComponentsRecord }>
    ) | LayoutComponentsRecord;
    scrollBehavior?: RouterScrollBehavior;
}
