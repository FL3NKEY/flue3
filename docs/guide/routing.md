# Роутинг и страницы

По умолчанию **flue3** не имеет инструментов для роутинга. Для этого можно установить и использовать npm пакет **@flue3/router**`, которые написал специально для **flue3** на основу **vue-router**.

## Установка

`npm`
```
npm install @flue3/router --save
```

`yarn`
```
yarn add @flue3/router
```

Так как **@flue3/router** это плагин, нам нужно его заиницилизировать в `createApp`.

`src/app.ts`
```typescript
import {createApp} from 'flue3';
import {createRouterPlugin} from '@flue3/router';

import App from '@/App.vue';

export default createApp(App, {
    plugins: [
        createRouterPlugin({
            routes: [/**/],
            layouts: {/**/},
        })
    ],
});
```

После, в корневом компоненте `AppRoot` нам нужно поместить компонент `RootView` для отображения страниц и лейаутов.

`src/App.vue`

```vue

<template>
    <AppRoot>
        <RootView />
    </AppRoot>
</template>

<script lang="ts" setup>
import {AppRoot} from 'flue3';
import {RootView} from '@flue3/router';
</script>
```

Так же, `@flue3/router` расширяет контекст приложения свойствами `route` (текущий роут) и `router` (инстанс **vue-router**).

`src/plugins/examplePlugin.ts`
```typescript
import {definePlugin} from 'flue3';
import {useRoute} from '@flue3/router';

export const createExamplePlugin = definePlugin(() => {
    const route = useRoute();
    let isDemo = false;
    
    if(route.query.demo) {
        isDemo = true;
    }
    
    inject('isDemo', isDemo);
});
```

## Конфигурация

`createRouterPlugin` принимает следующие параметры:

- `routes` - массив роутов, которые описывается так же как и во `vue-router`, но имеет некоторые дополнительные свойства.
- `layouts` - объект лейатов, где ключ это название, а значение это компонент лейаута.
- `scrollBehavior` - [Scroll Behavior](https://router.vuejs.org/guide/advanced/scroll-behavior.html)

## Страницы

Страницы и пути к ним описываются параметром `routes`.

```typescript
createRouterPlugin({
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/pages/Home.vue'),
        }, {
            path: '/auth',
            name: 'auth',
            component: () => import('@/pages/Auth.vue'),
        }
    ],
});
```

Но так же, `routes` может быть и асинхронной функцией, в которую передаётся контекст приложения, и на основе некоторых параметров, вы можете генерировать пользовательский массив роутов.

Для удобство типизации, если вы описываете роуты в отдельном файле, можно воспользоваться функцией `defineRoutes`.

`src/routes.ts`

```typescript
import { useAppContext } from 'flue3';
import { defineRoutes } from '@flue3/router';

export const routes = defineRoutes(async () => {
    const { isMobile } = useAppContext();

    return [
        {
            path: '/',
            name: 'home',
            component: isMobile
                ? () => import('@/pages/mobile/Home.vue')
                : () => import('@/pages/desktop/Home.vue')
        }, {
            path: '/auth',
            name: 'auth',
            component: isMobile
                ? () => import('@/pages/mobile/Auth.vue')
                : () => import('@/pages/desktop/Auth.vue')
        }
    ];
});
```

```typescript
import {routes} from '@/routes';

createRouterPlugin({
    routes,
});
```

## Лейатуы

Так же `@flue3/router` предоставляет функционал лейатов. Это компонент, который оборачивает корневой `RouterView`. В нём удобно размещать шапки, футеры и подобные элементы.

По умолчанию использовается лейаут `default`, мы его можем переопределить в конфигурации.

```typescript
createRouterPlugin({
    layouts: {
        default: () => import('@/layouts/Default.vue'),
        auth: () => import('@/layouts/Auth.vue'),
    },
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/pages/Home.vue'),
        }, {
            path: '/auth',
            name: 'auth',
            component: () => import('@/pages/Auth.vue'),
            // указываем для этого роута лейаут 'auth'
            layout: 'auth',
        }
    ],
});
```

Компонент лейаута должен имет `<slot></slot>`, где должен размещаться контент.

`src/layouts/Default.vue`
```vue
<template>
    <div class="my-layout">
       <slot></slot>
    </div>
</template>
```

Как и `routes`, `layouts` может быть асинхронной функцией и так же имеет `defineLayouts` для удобства типизации.

`src/layouts.ts`

```typescript
import { useAppContext } from 'flue3';
import { defineLayouts } from '@flue3/router';

export const routes = defineLayouts(async () => {
    const { isMobile } = useAppContext();
    return {
        default: isMobile
            ? () => import('@/layouts/mobile/Default.vue')
            : () => import('@/layouts/desktop/Default.vue'),
        auth: isMobile
            ? () => import('@/layouts/mobile/Auth.vue')
            : () => import('@/layouts/desktop/Auth.vue')
    };
});
```

```typescript
import {routes} from '@/routes';
import {layouts} from '@/layouts';

createRouterPlugin({
    routes,
    layouts,
});
```

## Middleware

Так же для каждого роута можно указать `middleware`, которые будут вызываться до его рендеринга.

`src/middleware/noAuth.ts`

```typescript
import { defineMiddleware, useRedirect, useState } from 'flue3';

export const noAuthMiddleware = defineMiddleware(() => {
    const user = useState('user');
    const { redirect } = useRedirect();

    if (user.value) {
        redirect('/');
    }
});
```

`src/middleware/onlyAuth.ts`
```typescript
import {defineMiddleware, useState, useRedirect} from 'flue3';

export const noAuthMiddleware = defineMiddleware(() => {
    const user = useState('user');
    const { redirect } = useRedirect();
    
    if(user.value) {
        redirect('/auth');
    }
});
```

```typescript
import {noAuthMiddleware} from '@/middleware/noAuth';
import {onlyAuthMiddleware} from '@/middleware/onlyAuth';

createRouterPlugin({
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/pages/Home.vue'),
        }, {
            path: '/auth',
            name: 'auth',
            component: () => import('@/pages/Auth.vue'),
            middleware: [noAuthMiddleware],
        }, {
            path: '/auth',
            name: 'auth',
            component: () => import('@/pages/User.vue'),
            middleware: [onlyAuthMiddleware],
        }
    ],
});
```

## Компоненты

### RootView

Корневой компонент роутинга.

Принимает в себя аттрибуты:

- `routeKey` - `key` свойство над `RouterView` компонентом.
- `transition` - js объект или css класс, описивающий логику переходов между страницами.

```vue
<template>
    <AppRoot>
        <RootView :routeKey="$route.path"
                  :transition="{ name: 'my-transition' } /* или просто 'my-transition' */" />
    </AppRoot>
</template>

<script lang="ts" setup>
import { AppRoot } from 'flue3';
import { RootView } from '@flue3/router';
</script>
```

### ChildView

Компонент для вложенных страниц. API компонента по аналогии с `RootView`.

```vue
<template>
    <div>
        <ChildView :routeKey="$route.path"
                   transition="my-transition" />
    </div>
</template>

<script lang="ts" setup>
import { AppRoot } from 'flue3';
import { ChildView } from '@flue3/router';
</script>
```

### ChildView

```vue
<template>
    <div>
        <RouterLink to="/">
            go to home
        </RouterLink>
    </div>
</template>

<script lang="ts" setup>
import {RouterLink} from '@flue3/router';
</script>
```

### RouterLink

```vue
<template>
    <div>
        <RouterLink to="/">
            go to home
        </RouterLink>
    </div>
</template>

<script lang="ts" setup>
import {RouterLink} from '@flue3/router';
</script>
```

## Composable функции

Экспортируемые функции из `@flue3/router` соотвествуют функциям **vue-router** пакета.

```vue
<template>
    <div>
        {{ route.path }}
        <button @click="goHome">
            go to home
        </button>
    </div>
</template>

<script lang="ts" setup>
import {useRoute, useRouter} from '@flue3/router';

const route = useRoute();
const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>
```
