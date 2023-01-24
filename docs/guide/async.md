# Асинхронные операции

Иногда, прежде чем что-то отобразить на странице, сначала нам нужно запросить данные на основе каких то параметров. Поэтому **flue3** будет ждать выполнение вашего кода практически везде.

## При инициалцзии

Вы можете указать асинхронный плагин или входную точку, фреймворк будет ждать выполнение вашего асинхронного кода перед отображением.

`src/app.ts`
```typescript
import {createApp} from 'flue3';

export default createApp(App, {
    plugins: [
        async () => {
            // логика асинхронного плагина...
        }
    ]
}, async () => {
    // логика универсальной асинхронной входной точки
});
```

`src/entryClient.ts`
```typescript
import {defineEntry} from 'flue3';

export default defineEntry(async () => {
    // логика асинхронной клиентской входной точки...
});
```

## В компонентах

Так же асинхронное выполнение кода доступна и в компонентах в функции `setup`. С [Suspense](https://vuejs.org/guide/built-ins/suspense.html) SSR сервер и редеринг на клиенте будут ожидать выполнения асинхронного, прежде чем что-то отобразить.

```vue

<template>
    <MyAsyncComp :data="data" />
</template>

<script lang="ts" setup>
import {useAsyncData, useMiddleware} from 'flue3';
import {defineAsyncComponent} from 'vue';

import {myAsyncMiddleware} from '@/middleware/myAsyncMiddleware.ts';

const MyAsyncComp = defineAsyncComponent(
    () => import('@/components/MyAsyncComp.vue')
);

await useMiddleware(myAsyncMiddleware);

const { data } = await useAsyncData(
    'someFetch',
    async () => { /* fetch logic */ }
);
</script>
```
