# Перенаправление навигации

Если вам нужно сделать редирект на другой путь/сайт например в `middleware`, то можно воспользоваться функцией [useRedirect](/api/composables#useredirect).

`src/middleware/isAuthMiddleware.ts`;
```typescript
import {defineMiddleware, useRedirect, useState} from 'flue3';

export const isAuthMiddleware = defineMiddleware(() => {
    const user = useState('user');
    const {redirect} = useRedirect();
    
    if(!user.value) {
        redirect('/auth');
    }
});
```

Если этот код будет выполнен на сервере, то произойдёт `HTTP` редирект с заголовком `Location` и соответствующим `HTTP` кодом. На клиенте это будет `window.location.href`, но с плагином [роутинга](/guide/routing), этот метод будет вызывать `router.push`.
