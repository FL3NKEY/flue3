import { RouteRecordNormalized } from 'vue-router';

export const trailingSlash = (url: string) => {
    return url.endsWith('/') ? url.slice(0, -1) : url;
};

export const findLastComponentWithProp = <T>(matched: RouteRecordNormalized[], propName: string): T | undefined => {
    return matched.reverse().map((matched) => {
        return matched.components?.default || {};
    }).find((matchedComponent) => {
        return matchedComponent[propName as keyof typeof matchedComponent] !== undefined;
    }) as T;
};
