# Приложение

## createApp()

Тип:
```typescript
function createApp(
    App: Component,
    options?: CreateAppOptions,
    universalEntry?: (appContext: AppContext) => void
)

interface CreateAppOptions {
    plugins?: []; // массив плагинов
}
```

Метод создания приложения. Должен эксперотироваться в основной точки входа.

`src/app.ts`
```typescript
import { createApp } from 'flue3';

import App from './App.vue';

export default createApp(App, {
    plugins: [/* plugins */]
}, (appContext) => {
    /* некоторая логика (может быть асинхроная) */
    /* эта функция будет вызвана на клиенте и сервере перед отображением */
});
```
