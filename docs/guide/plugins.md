# Плагины

Для расширений возможностей фреймворка и приложения, можно создать свой плагин.

`src/plugins/myPlugin.ts`
```typescript
import {definePlugin} from 'flue3';

interface MyPluginOptions {
    prefix: string;
}

export const createMyPlugin = definePlugin<MyPluginOptions>(({
    appContext,
    inject,
}, /* принимаем опции вторым аргументом */ {
    prefix,
}) => {
    /*
    Если вам нужен инстант Vue приложения (например для .use),
    то вы можете его достать из appContext.vueApp
    */
    appContext.vueApp.use(/* external plugin */);
    
    const hello = (str: string) => console.log(`${prefix} ${str}`);
    
    // в appContext будет добавлено свойство hello
    inject('hello', hello);
});
```

Плагины нужно регистрировать в [createApp](/api/#createapp)

`src/app.ts`
```typescript
import {createApp} from 'flue3';

import {createMyPlugin} from '@/plugins/myPlugin';

export default createApp(App, {
    plugins: [
        createMyPlugin({
            prefix: 'Hello',
        }),
    ]
});
```

После, наше новое свойство будет доступно из контекста приложения.

```vue
<script lang="ts">
import {useAppContext} from 'flue3';

const {hello} = useAppContext();

// console.log('Hello world');
hello('world');
</script>
```
