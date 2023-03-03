# Файл конфигурации

**flue3** имеет некоторые настройки, которые можно изменить в файле конфигурации.

Создайте файл `flue3.config.(js|ts)` в корневой папке проекта. Этот файл должен экспортировать объект конфигурации.

`flue3.config.ts`
```typescript
import {defineConfig} from 'flue3';

export default defineConfig({
    // ...конфигурация
});
```

::: tip Определение путей
Некоторые параметры, которые содержут в себе название файла, резолвятся из директории исходников (по умолчанию `src`), поэтому дописывать к ним название этой директории не нужно.
:::

## appId

Тип: `string`<br>
Значение по умолчанию: `'__flue3'`

Идентификатор приложения. Используется в основном для генирации уникальных DOM-узлов.

## appConfig

Тип: `object`<br>
Значение по умлочанию: `{}`

Ваш объект конфигурации приложения. Здесь можно хранить некоторые данные, которые будут доступны в контексте приложения.

::: warning Предупреждение
Не храните приватные данные в этом объекте! Так как эти данные хранятся и на клиенте, каждый пользователь может их просмотреть.
:::

`flue3.config.ts`
```typescript
import { defineConfig } from 'flue3';

export default defineConfig({
    appConfig: {
        myPublicToken: 'token_value',
    }
});
```

## basePath

Тип: `string`<br>
Значение по умлочанию: `'/'`

Указывает базовый путь для работы приложения. Все статические файлы, роутинг и прокси будут иметь именно этот префикс.

Значение должно начинаться и заканчиваться слешем: `/example/`.

## entryFilename

Тип: `string`<br>
Значение по умолчанию: `'./app'`

Путь и название файла для основной входной точки приложения.

Пример пользовательского расположения файла

`flue3.config.ts`
```typescript
import { defineConfig } from 'flue3';

export default defineConfig({
    entryFilename: './app/app.ts',
});
```

```
.
├─ src
│  ├─ app
│  │  └─ app.ts
└─ flu3.config.ts
```

## entryClientFilename

Тип: `string`<br>
Значение по умолчанию: `'./entryClient'`

Путь и название файла для входной точки приложения на стороне клиента.

## entryServerFilename

Тип: `string`<br>
Значение по умолчанию: `'./entryServer'`

Путь и название файла для входной точки приложения на стороне сервера. Работает только в режиме SSR.

## headTemplateFilename
Тип: `string | boolean`<br>
Значение по умолчанию: `false`

Путь до шаблоны, который будет имплементирован в `<head>` основного шаблона. Файл должен быть с расширением `.html`.

`flue3.config.ts`
```typescript
import { defineConfig } from 'flue3';

export default defineConfig({
    headTemplateFilename: './head.html',
});
```

`src/head.html`
```html
<title>My app</title>
<!--[Здесь так же доступна шаблонизация с помощью mustache]-->
<meta name="token" content="{{ appConfig.myPublicToken }}">
```

## loadingTemplateFilename
Тип: `string | boolean`<br>
Значение по умолчанию: `false`

Путь до шаблоны с идникатором загрузки в режиме SPA. Файл должен быть с расширением `.html`. Это шаблон появляется при первой отрисовки, когда ещё приложение не готово.

`flue3.config.ts`
```typescript
import { defineConfig } from 'flue3';

export default defineConfig({
    loadingTemplateFilename: './loading.html',
});
```

`src/loading.html`
```html
<style>
    .loading {
        color: red;
    }
</style>

<div class="loading">...</div>

<!--[Здесь так же доступна шаблонизация с помощью mustache]-->
<div>{{ appConfig.myData }}</div>
```

## srcPath
Тип: `string`<br>
Значение по умолчанию: `'src'`

Название директории с исходниками.

## outputPath
Тип: `string`<br>
Значение по умолчанию: `'dist'`

Название директории, куда попадёт итоговый бандл после сборки.

## mode
Тип: `'development' | 'production'`<br>
Значение по умолчанию: `process.env.NODE_ENV`

## ssr
Тип: `boolean`<br>
Значение по умолчанию: `true`

Режим работы приложения. Если значение `true`, то приложение будет работать в режиме SSR, если `false` то в режиме SPA.

## minify
Тип: `boolean`<br>
Значение по умолчанию: `process.env.NODE_ENV !== 'development'`

Минифицировать ли бандл-файлы.

## aliases
Тип: `Record<string, string>`<br>
Значение по умолчанию: `{}`

Алиасы для резолвинга путей в импортах. Реализуется с помощью [Vite resolve.alias](https://vitejs.dev/config/shared-options.html#resolve-alias).

По умолчанию из коробки указаны несколько алиасов:
- `@` - Путь к директрии исходников 
  ```typescript
  import Comp from '@/components/Comp.vue';
  ```
- `~` - Путь к корневой директории
  ```typescript
  import Comp from '~/src/components/Comp.vue';
  ```

## excludeDeps
Тип: `string[]`<br>
Значение по умолчанию: `[]`

[Vite optimizeDeps.exclude](https://vitejs.dev/config/dep-optimization-options.html#optimizedeps-exclude)

## server
Тип: `object`<br>
Значение по умолчанию: `{...}`

`flue3.config.ts`
```typescript
import {defineConfig} from 'flue3';

export default defineConfig({
    server: {
        hostname: '0.0.0.0',
        port: 3000,
        proxies: {},
        plugins: [],
        middleware: [],
    }
});
```

Конфигурация внутреннего HTTP сервера.

Реализуется с помощью [h3](https://github.com/unjs/h3).

## server.hostname
Тип: `string`<br>
Значение по умолчанию: `'0.0.0.0'`

Хост HTTP сервера.

## server.port
Тип: `number`<br>
Значение по умолчанию: `3000`

Порт HTTP сервера.

## server.proxies
Тип: `object`<br>
Значение по умолчанию: `{}`

Настройки proxy-запросов. Работает в режиме SSR или при запуска сервера в режиме разработки.

Реализуется при помощи пакета [http-proxy](https://www.npmjs.com/package/http-proxy).

`flue3.config.ts`
```typescript
import {defineConfig} from 'flue3';

export default defineConfig({
    server: {
        proxies: {
            '/api': {
                target: 'http://jsonplaceholder.typicode.com',
                changeOrigin: true,
            },
        },
    }
});
```

Теперь при обращении `/api/*` все запросы будут переадрисовываться на `http://jsonplaceholder.typicode.com`.

## server.plugins
Тип: `string[]`<br>
Значение по умолчанию: `[]`

Плагины приложения на стороне сервера. Представляет из себя массив путей к модулям.

`flue3.config.ts`
```typescript
import {defineConfig} from 'flue3';

export default defineConfig({
    server: {
        plugins: ['@/server/plugins/myServerPlugin.ts'],
    }
});
```

`src/server/plugins/myServerPlugin.ts`

```typescript
import { defineServerPlugin } from 'flue3';

export default defineServerPlugin(async (appContext) => {
    // логика серверного плагина...
});
```

## server.middleware
Тип: `object[]`<br>
Значение по умолчанию: `[]`

Серверные middleware, позволяют выполнять код на каждый GET HTTP запрос по указанному пути.

`flue3.config.ts`
```typescript
import { defineConfig } from 'flue3';

export default defineConfig({
    server: {
        middleware: [{
            path: '*',
            handler: '@/server/middleware/myServerMiddleware.ts',
        }],
    }
});
```

`src/server/middleware/myServerMiddleware.ts`

```typescript
import { defineServerMiddleware } from 'flue3';

export default defineServerMiddleware((appConfig) => (h3Event) => {
    // логика серверного middleware...
});
```
