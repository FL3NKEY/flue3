# Перенаправление навигации

Если вам нужно сделать редирект на другой путь/сайт например в `middleware`, то можно воспользоваться методом [redirect](/api/context#rediect) из контекста приложения.

`src/middleware/isAuthMiddleware.ts`;
```typescript
import {defineMiddleware} from 'flue3';

export const isAuthMiddleware = defineMiddleware((appContext) => {
    if(!appContext.state.user) {
        appContext.redirect('/auth');
    }
});
```

Если этот код будет выполнен на сервере, то произойдёт `HTTP` редирект с заголовком `Location` и соответствующим `HTTP` кодом. На клиенте это будет `window.location.href`, но с плагином [роутинга](/guide/routing), этот метод будет вызывать `router.push`.
