# Работа со стейтом

Так как наш код в режиме SSR выполняется на клиенте и на сервере и к примеру взяв какие то данные на сервере, мы должны их как то передать клиенту (браузеру). Для этого мы можем воспользоваться свойством [state](/guide/config#state) и методом [writeState](/guide/config#writestate) из контекста приложения.

```typescript
import {definePlugin} from 'flue3';

export const createExamplePlugin = definePlugin(({ appContext }) => {
    // выполним writeState тольо на сервере
    if(import.meta.env.SSR) {
        appContext.writeState('paramFromServer', 'some value');
    }

    // 'some value'
    console.log(appContext.state.paramFromServer);
});
```

После для получения стейта в `setup` функциях, мы можем воспользоваться [useState](/api/composables#usestate).

```vue
<script lang="ts" setup>
import {useState} from 'flue3';

const paramFomServer = useState('paramFromServe');

// 'some value'
console.log(paramFomServer.value);
</script>
```
