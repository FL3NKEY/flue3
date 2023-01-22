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
    onAfterHook: (hook: AppPluginAfterHook) => void;
    onBeforeRender: (hook: AppPluginOnBeforeRenderHook) => void;
    onAfterRender: (hook: AppPluginOnAfterRenderHook) => void;
    onAfterEntry: (hook: AppPluginOnAfterEntryHook) => void;
}

type AppPluginAfterHook = () => Promise<void> | void;
type AppPluginOnBeforeRenderHook = (renderPartials: SSRTemplatePartials) => Promise<void> | void;
type AppPluginOnAfterRenderHook = (renderPartials: SSRTemplatePartials) => Promise<void> | void;
type AppPluginOnAfterEntryHook = () => Promise<void> | void;
```

В функцию плагина передаётся контекст, метод для расширения контекста и некоторые полезные хуки. 
Так же плагин может быть асинхронным.

`src/plugins/examplePlugin.ts`
```typescript
import { definePlugin } from 'flue3';

export const createExamplePlugin = definePlugin(({
    appContext,
    inject,
    onAfterHook,
    onBeforeRender,
    onAfterRender,
    onAfterEntry,
}) => {
    // логика плагина...
});
```




