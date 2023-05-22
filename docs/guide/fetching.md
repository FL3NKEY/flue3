# Фетчинг данных

**flue3** не предоставляет из коробки HTTP клиент, но имеет полифил для работы с [Fetch API](https://developer.mozilla.org/ru/docs/Web/API/Fetch_API) на сервере.

## При инициализации

При инициализации приложения, вы можете запросить некоторые данные и сохранить их в стейт с помощью [useState](/api/composables#usestate) с последующем использованием в компонентах.

`src/app.ts`
```typescript
import {createApp, useState} from 'flue3';

import App from '@/App.vue';

export default createApp(App, {}, async () => {
    const user = useState('user');
    
    /*
    Так как эта функция вызывается на сервере и клиенте,
    то если мы вызоваем эту функция снова на клиенте,
    когда она уже отработала на сервере,
    то нет смысла запрашивать данные второй раз,
    так как на клиенте state.user уже будет в себе содержать данные.
     */
    if(!user.value) {
        try {
            /* запрашивает данные с api */
            const userRes = await fetch('/api/user')
                .then((response) => response.json());

            /* сохраняем данные в глобальном стейте */
            user.value = userRes;
        } catch (err) {
           /*
           Здесь мы можем вызвать appContext.error(...),
           если хотим показать страницу ошибки.
           */
           console.error('failed to fetch user', err);
        }
    }
});
```

После в `setup` функциях, мы можем воспользоваться так же [useState](/api/composables#usestate) для получениях данных из глобального стейте.

`src/App.vue`
```vue
<template>
    <div>
        <!--
        при первой отрисовки компонента
        данные уже доступны и готовы к использованию
        -->
        {{ user }}
    </div>
</template>

<script lang="ts" setup>
import {useState} from 'flue3';

const user = useState('user');
</script>
```

## В setup функциях

В `setup` функциях можно воспользоваться функцией [useAsyncData](/api/composables#useasyncdata) что бы не заботиться о переиспользовании и гидрации стейта с сервера на клиент.

```vue
<template>
    <div>
        <!--
        при первой отрисовки компонента
        данные уже доступны и готовы к использованию
        -->
        {{ user }}
    </div>
</template>

<script lang="ts" setup>
import {useAsyncData} from 'flue3';

const { data: user } = await useAsyncData('user', async () => {
    const user = await fetch('/api/user')
        .then((response) => response.json());

    return user;
});
</script>
```
