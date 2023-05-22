# Плагины

Для расширений возможностей фреймворка и приложения, можно создать свой плагин.

## Создание плагина

`src/plugins/myPlugin.ts`
```typescript
import {definePlugin, useAppContext} from 'flue3';

interface MyPluginOptions {
    prefix: string;
}

export const createMyPlugin = definePlugin<MyPluginOptions>(({
    inject,
}, /* принимаем опции вторым аргументом */ {
    prefix,
}) => {
    /*
    Если вам нужен инстант Vue приложения (например для .use),
    то вы можете его достать из appContext.vueApp
    */
    const {vueApp} = useAppContext();
    vueApp.use(/* external plugin */);
    
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

## Типизация новых свойств

В случае типизации нового свойства в `appContext`, вы можете создать файл `*.d.ts` и подключить его в `tsconfig.json` файле.

`AppContext.d.ts`
```typescript
import 'flue3';

declare module 'flue3' {
    interface AppContext {
        hello: (str: string) => void;
    };
}
```
