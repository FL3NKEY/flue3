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

## loadingTemplateFilename
Тип: `string | boolean`<br>
Значение по умолчанию: `false`

Путь до шаблоны с идникатором загрузки в режиме SPA. Файл должен быть с расширением `.html`. Это шаблон появляется при первой отрисовки, когда ещё приложение не готово.

## srcPath
Тип: `string |`<br>
Значение по умолчанию: `'src'`

Название директории с исходниками.

## outputPath
Тип: `string |`<br>
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
