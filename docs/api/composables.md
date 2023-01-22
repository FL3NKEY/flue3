# Composable функции

**flue3** предоставляет некоторые полезные composable функции. Их возможно использовать в `setup` функциях.

## useAppContext

Тип:
```typescript
function useAppContext(): AppContext
```

Функция, которая возвращает контекст приложения.

```vue
<script lang="ts" setup>
import { useAppContext } from 'flue3';

const appContext = useAppContext();
</script>
```

## useCookie

Тип:

```typescript
function useCookie<T extends CookieValue>(
    key: string,
    initialValue?: () => T,
    options?: CookieOptions,
): Ref<T>
```

Функция для биндинга куки-параметра с `ref` значением.

```vue
<script lang="ts" setup>
import { useCookie } from 'flue3';

const count = useCookie<number>('count', () => 1);

console.log(document.cookie) // ""
console.log(count.value); // 1

count.value = 2;

console.log(document.cookie) // "count=2"
</script>
```

## useError

Тип:
```typescript
function useError(): {
    error: (err: any) => void,
    clearError: () => void,
    errorState: AppErrorState,
}
```

Функция для отображения и очистки глобального состояния ошибки.

```vue
<script lang="ts" setup>
import { useError } from 'flue3';

const {error} = useError();

// выполняет throw и показывает страницу ошибки
error({
    status: 404,
    message: 'Страница не найдена'
});

console.log('этот код не выполнится');
</script>
```

## useFetch

Тип:
```typescript
function useFetch <T>(
    key: string,
    hook: FetchHook<T>,
    options?: FetchOptions<T>,
): FetchReturn<T>

type FetchHook<T> = (appContext: AppContext) => Promise<T> | T;

interface FetchOptions<T> {
    lazy?: boolean;
    initialFetch?: boolean;
    initialValue?: () => T;
}

interface FetchReturnBody<T> {
    data: Ref<T>;
    pending: ComputedRef<boolean>;
    error: ComputedRef<unknown>;
    load: loadFn;
    refresh: loadFn;
}

type FetchReturn<T> = Promise<FetchReturnBody<T>> | FetchReturnBody<T>;
```

Функция для работы и получения асинхроных данных и их сереализации при гидрации приложения уже на клиенте.

```vue
<script lang="ts" setup>
import { useFetch } from 'flue3';

const {
    data,
    pending,
    error,
    load,
    refresh,
} = await useFetch('posts', async () => {
    const posts = await fetch('/api/posts')
        .then((response) => response.json());

    // возвращаемый объект будет передан в свойство data как ref
    return posts;
});

// данные получены и готовы к отображению
console.log(data.value);
</script>
```

### lazy

Если передать `lazy` параметр, то `useFetch` не будет возвращать `Promise` и выполнится только на клиенте (браузере) в хуке `onMounted`.

```vue
<script lang="ts" setup>
import { useFetch } from 'flue3';

const {
    data,
    pending,
    error,
    load,
    refresh,
} = useFetch('posts', async () => {
    // логика запроса
}, {
  lazy: true, // указаываем lazy параметр
});

// данные ещё не получены
// например можно использовать pending для условного рендеринга
console.log(data.value);
</script>
```

### initialFetch

`useFetch` сам инициализирует переданую функцию, где описана ваша логика. Если передать `initialFetch` параметр, то `useFetch` не будет возвращать `Promise`. Для вызова используйте метод `load`.

```vue
<script lang="ts" setup>
import { useFetch } from 'flue3';

const {
    data,
    pending,
    error,
    load,
    refresh,
} = useFetch('posts', async () => {
    // логика запроса
}, {
  initialFetch: false, // указаываем initialFetch параметр
});

// данные ещё не получены
console.log(data.value);

await load();

// данные получены и готовы к отображению
console.log(data.value);
</script>
```

## useLazyFetch

`useLazyFetch` это простая обёртка над `useFetch`, который по умолчанию содержит в себе параметр `lazy: true`. Таким образом его API  одинаковое как и с `useFetch`.

```vue
<script lang="ts" setup>
import { useLazyFetch } from 'flue3';

const {
    data,
    pending,
    error,
    load,
    refresh,
} = useLazyFetch('posts', async () => {
    // логика запроса
});

// данные ещё не получены
// например можно использовать pending для условного рендеринга
console.log(data.value);
</script>
```

## useMiddleware

Тип:
```typescript
function useMiddleware(middleware: (appContext: AppContext) => Promise<void> | void);
```

Функция для вызовы и обработки middleware в `setup` функциях.

```vue
<script lang="ts" setup>
import { useMiddleware, defineMiddleware } from 'flue3';

const onlyAuth = defineMiddleware((appContext) => {
  // логика middleware
});

await useMiddleware(onlyAuth);
</script>
```

## useRedirect

Тип:
```typescript
function useRedirect(): {
    redirect: (location: string, status?: number) => void
}
```

Функция для выполнения перенаправления навигации.

```vue
<template setup lang="ts">
import { useRedirect } from 'flue3';

const { redirect } = useRedirect();

redirect('https://google.com');
</template>
```

## useState

Тип:
```typescript
function useState<T>(key: string, initialValue?: () => T): Ref<T>
```

Функция для шейринга стейта между серверным и клиентским окружением, и так же между компонентами.

```vue

<script lang="ts" setup>
import { usetState } from 'flue3';

const random = useState<number>('random', () => Math.random() /* 0.5 */);

// 0.5 на сервере и клиенте
console.log(random.value);

random.value = 0.4;

// 0.4. это значение сохранится и в других компонентах.
console.log(random.value);
</script>
```
