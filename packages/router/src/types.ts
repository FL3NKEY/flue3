import { Component } from 'vue';
import { RouteRecordRaw, RouterScrollBehavior } from 'vue-router';

export type LayoutComponent = (() => Promise<Component | { default: Component }>) | Component;
export type LayoutComponentsRecord = Record<string, LayoutComponent>;

export interface RouterPluginOptions {
    routes: RouteRecordRaw[];
    layouts?: LayoutComponentsRecord;
    scrollBehavior?: RouterScrollBehavior;
}
