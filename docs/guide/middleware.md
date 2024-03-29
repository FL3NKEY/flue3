# Middleware

**flue3** из коробки `middleware` имеет скорее семантическую значимость, нежели техническую. Без плагинов **flue3** предоставляет функции `defineMiddleware` и [useMiddleware](/api/composables#usemiddleware), которая по сути просто обёртка, которая передаёт [appContext](/api/context). 

По факту, `middleware` полезны в связке с [роутингом](/guide/routing).

`src/middleware/isAuthMiddleware.ts`;
```typescript
import {defineMiddleware, useState, useError} from 'flue3';

export const isAuthMiddleware = defineMiddleware(() => {
    const user = useState('user');
    const {error} = useError();
    
    if(!user.value) {
        error({
            status: 403,
            message: 'Authorization required',
        });
    }
});
```

```vue
<template>
    <div>
        {{ user }}
    </div>
</template>

<script lang="ts" setup>
import {useMiddleware, useState} from 'flue3';
import {isAuthMiddleware} from '@/middleware/isAuthMiddleware';

await useMiddleware(isAuthMiddleware);

const user = useState('user');
</script>
```
