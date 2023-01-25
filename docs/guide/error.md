# Обработка ошибок

Во время выполнения кода, если возникнет ошибка в рантайме, то отобразится страница ошибки. Её можно переопределить, передав слот `error` в [AppRoot](/api/components#approot) компоненте.

`src/App.vue`

```vue

<template>
    <AppRoot>
        <!--
        слот для отображения ошибки
        можно передать асинхронный компонент
        Suspense сделает своё дело
        -->
        <template #error="errorState">
          <CustomError :error="errorState" />
        </template>
        <div>
            Your content...
        </div>
    </AppRoot>
</template>
<script lang="ts" setup>
import {defineAsyncComponent} from 'vue';
import {AppRoot} from 'flue3';

const CustomError = defineAsyncComponent(
    () => import('@/components/CustomError.vue')
);
</script>
```

Для пользовательского вызова ошибки, можно воспользоваться методом [error](/api/context#error) из контекста приложения.

`src/middleware/isAuthMiddleware.ts`
```typescript
import {defineMiddleware} from 'flue3';

export const isAuthMiddleware = defineMiddleware((appContext) => {
    if(!appContext.state.user) {
        appContext.error({
            status: 403,
            message: 'Authorized required',
        });
    }
});
```

```vue
<script lang="ts" setup>
import {useMiddleware} from 'flue3';
import {isAuthMiddleware} from '@/middleware/isAuthMiddleware';

await useMiddleware(isAuthMiddleware);
</script>
```

Для вызова ошибки в `setup` функциях можно воспользоваться [useError](/api/composables#useerror).

```vue
<script lang="ts" setup>
import {useError} from 'flue3';

const {error} = useError();

error({
    status: 500,
    message: 'Unknown error'
});
</script>
```

Если вызывать ошибку на сервере, то переданный `status` будет соответствовать `HTTP` коду ответа.
