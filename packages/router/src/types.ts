import { Component } from 'vue';
import { RouteRecordRaw, RouterScrollBehavior } from 'vue-router';
import { AppContext } from 'flue3/lib/types/AppContext.js';

export type LayoutComponent = (() => Promise<Component | { default: Component }>) | Component;
export type LayoutComponentsRecord = Record<string, LayoutComponent>;

export interface RouterPluginOptions {
    routes: (
        (
            appContext: AppContext
        ) => RouteRecordRaw[] | Promise<RouteRecordRaw[] | { default: RouteRecordRaw[] }>
    ) | RouteRecordRaw[];
    layouts?: (
        (
            appContext: AppContext
        ) => LayoutComponentsRecord | Promise<LayoutComponentsRecord | { default: LayoutComponentsRecord }>
    ) | LayoutComponentsRecord;
    scrollBehavior?: RouterScrollBehavior;
}
