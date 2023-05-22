# Работа со стейтом

Так как наш код в режиме SSR выполняется на клиенте и на сервере и к примеру взяв какие то данные на сервере, мы должны их как то передать клиенту (браузеру). Для этого мы можем воспользоваться свойством [useState](/api/composables#usestate).

```typescript
import {definePlugin, useState} from 'flue3';

export const createExamplePlugin = definePlugin(({ appContext }) => {
    const paramFromServer = useState('paramFromServer');
    
    // выполним тольо на сервере
    if(import.meta.env.SSR) {
        paramFromServer.value = 'some value';
    }

    // этот console.log выполнится и на сервере и на клиенте и отобразит 'some value'
    console.log(paramFromServer.value);
});
```

После для получения стейта в `setup` функциях, мы можем воспользоваться так же [useState](/api/composables#usestate).

```vue
<script lang="ts" setup>
import {useState} from 'flue3';

const paramFomServer = useState('paramFromServe');

// 'some value'
console.log(paramFomServer.value);
</script>
```
