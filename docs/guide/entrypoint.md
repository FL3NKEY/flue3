# Входные точки приложения

Входные точки приложения это некоторые функции, которые выполняются во время инициализации приложения.

По мимо универсальной точки входа, который предоставляет функция [createApp](/api/#createapp), возможно указать и точки входа для разных окружений (клиент/сервер). Указываются они отдельными файлами, что бы попавшие в сборку модули не пересекались между окружениями.

По умолчанию **flue3** будет автоматически резолвить файлы `entryClient.(js|ts)` и `entryServer.(js|ts)` из директории исходных файлов. Путь к ним так же можно изменить в файле конфигураций в параметрах [entryClientFilename](/guide/config.html#entryclientfilename) и [entryServerFilename](/guide/config.html#entryserverfilename)

Каждый файл должен экспортировать функцию (она может быть асинхронная). Для типизации можно использовать функцию обёртку `defineEntry`. 

`src/entryClient.ts`
```typescript
import {defineEntry, useAppContext} from 'flue3';

export default defineEntry(() => {
    const appContext = useAppContext();
    console.log('hello from browser!', appContext);
});
```

`src/entryServer.ts`
```typescript
import {defineEntry, useAppContext} from 'flue3';

export default defineEntry(() => {
    const appContext = useAppContext();
    console.log('hello from server!', appContext);
});
```
