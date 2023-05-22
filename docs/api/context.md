---
title: 'Контекст'
---

# Контекст `appContext`

**flue3** предоставляет свой контекст приложения. Ниже перечислены свойства, которые присутствуют из коробки, но этот контекст так же расширяем с помощью плагинов. [Подробнее](/guide/plugins)

## vueApp

Тип: `App`

Контекст **Vue** приложения.

## config

Тип: `readonly object`

Объект конфигурации `appConfig`, который определён в [файле конфигурации](/guide/config).

## isClient

Тип: `boolean`

`true` если выполнение происходит на клиенте (браузере).

## isServer

Тип: `boolean`

`true` если выполнение происходит на сервере.

## state

Тип: `readonly reactive object`

Расшаренный стейт приложения, который синхронизируется с клиентской и серверной частью при гидрации.

## req

Тип: `NodeIncomingMessage | undefined`

Объект запроса. *Доступен только на сервере*.

## res

Тип: `NodeServerResponse | undefined`

Объект ответа. *Доступен только на сервере*.

## inject

Тип: `<T>(key: string, value: T, override?: boolean) => void`

Метод для расширения `appContext`.

## errorState

Тип: `AppErrorState`
```typescript
interface AppErrorState {
    status: number;
    message: string;
    stack: string;
    captured: boolean;
}
```

Стейт ошибки для обработки промежуточных точек и отображения его в компоненте ошибок.

## error

Тип: `(err: any) => void`

Метод для вызова ошибки и записи его в `errorState`

## clearError

Тип: `() => void`

Метод для сброса `errorState`

## redirect

Тип: `(location: string, status?: number) => void`

Метод для перенаправления навигации.

## response

Тип: `AppResponse`
```typescript
interface AppResponse {
    status?: number;
    statusText?: string;
    headers?: Record<string, string | number | string[]>;
}
```

Стейт для расширения `res` объекта.

## writeResponse

Тип: `(response: AppResponse) => void`

Метод для записи в `response`

## setCookie

Тип: `(key: string, value: CookieValue, options?: CookieOptions) => void`
```typescript
type CookieValue = string | number | boolean | undefined
```
```typescript
interface CookieOptions {
    Expires?: Date| number | string;
    'Max-Age'?: Date| number | string;
    Path?: string;
    Domain?: string;
    Secure?: boolean;
    SameSite?: 'lax' | 'strict' | 'none';
}
```

Метод для изменения cookie.

## getCookie

Тип: `(key: string) => CookieValue`

Метод для получения cookie.

## hasCookie

Тип: `(key: string) => boolean`

Метод для проверки наличия текущего cookie.

## removeCookie

Тип: `(key: string) => void`

Метод для удаления текущего cookie.

## isRedirected

Тип: `() => void`

## clientRedirect

Тип: `(location: string) => void`

## hooks

Тип: `Hookable<AppHooks>`
```typescript
interface AppHooks {
    'app:created': () => Promise<void> | void;
    'render:before': (renderPartials: SSRTemplatePartials) => Promise<void> | void;
    'render:after': (renderPartials: SSRTemplatePartials) => Promise<void> | void;
    'entry:after': () => Promise<void> | void;
    'state:changed': (key: string, data: any) => void;
    'state:deleted': (key: string) => void;
}
```

Объект для работы с хуками, основанный на [hookable](https://www.npmjs.com/package/hookable).
