import { defineMiddlewares } from './defines/defineMiddlewares.js';
import {
    RouteRecordRaw,
    RouterScrollBehavior,
    RouteLocationNormalized,
} from 'vue-router';
import { Component } from 'vue';
import { AppContext } from 'flue3/lib/types/AppContext.js';

export { AppContext };

export interface MiddlewareContext {
    appContext: AppContext;
    redirect: AppContext['redirect'];
    error: AppContext['error'];
    route: RouteLocationNormalized;
    fromRoute: RouteLocationNormalized;
}

export type Middleware = (middlewareContext: MiddlewareContext) => void;
export type Middlewares = ((middlewareContext: MiddlewareContext) => void)[];

export type AsyncData = (<T>(middlewareContext: MiddlewareContext) => T) |
(<T>(middlewareContext: MiddlewareContext) => Promise<T>)

export type BaseComponent = {
    middlewares?: Middlewares;
    asyncComponents?: ((middlewareContext: MiddlewareContext) => Record<string, Component>) |
    ((middlewareContext: MiddlewareContext) => Promise<Record<string, Component>>);
    asyncData?: AsyncData;
    components?: Record<string, Component>;
} & Component;

export type PageComponent = BaseComponent & {
    layout?: string |
    ((middlewareContext: MiddlewareContext) => string) |
    ((middlewareContext: MiddlewareContext) => Promise<string>);
};
export type LayoutComponent = BaseComponent;

export type Layout = (() => Promise<LayoutComponent>) | (() => Promise<{ default: LayoutComponent }>) | LayoutComponent;
export type Layouts = Record<string, Layout>;

export interface RouterPluginOptions {
    routes: RouteRecordRaw[];
    scrollBehavior?: RouterScrollBehavior;
    middlewares?: ReturnType<typeof defineMiddlewares>;
    layouts?: Layouts;
}
