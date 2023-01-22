# Плагины

Определить плагин можно с помощью функции-обёртки `definePlugin`.

Тип:
```typescript
function definePlugin<T extends Record<any, any> | undefined>(
    plugin: (pluginContext: AppPluginContext, options: T) => void,
) => (
    options?: T
) => (
    pluginContext: AppPluginContext
) => plugin(pluginContext, options!)

interface AppPluginContext {
    appContext: AppContext;
    inject: AppContext['inject'];
}
```

В функцию плагина передаётся контекст и метод для расширения контекста. 
Так же плагин может быть асинхронным.

`src/plugins/examplePlugin.ts`
```typescript
import { definePlugin } from 'flue3';

interface ExamplePluginOptions {
    name: string;
    id: number;
}

export const createExamplePlugin = definePlugin<ExamplePluginOptions>(({
    appContext,
    inject,
}, options) => {
    // логика плагина...
});
```


