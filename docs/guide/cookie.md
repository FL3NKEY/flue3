# Работа с cookie

На сервере не доступен `document.cookie`, поэтому в нём нужен другой подход (работа с HTTP заголовками). **flue3** предоставляет свою обёртку для работы с куки, которая обратаывает оба случая (клиентский и серверный).

## В контексте приложения

Контекст приложения имеет методы [setCookie](/api/context#setcookie), [getCookie](/api/context#getcookie), [hasCookie](/api/context#hascookie) и [removeCookie](/api/context#removecookie) для работы с куки.

`src/plugins/examplePlugin.ts`;
```typescript
import {definePlugin} from 'flue3';

export const createExamplePlugin = definePlugin(({ appContext }) => {
    // false
    console.log(appContext.hasCookie('theme'));
    // undefined
    console.log(appContext.getCookie('theme'));

    appContext.setCookie('theme', 'dark');

    // true
    console.log(appContext.hasCookie('theme'));
    // 'dark'
    console.log(appContext.getCookie('theme'));
    
    appContext.removeCookie('theme');
});
```

## В setup функциях

В `setup` функциях можно воспользоваться функцией [useCookie](/api/composables#usecookie), который создаёт двухсторонний биндинг значения с куки-файлом.

```vue
<template>
    <div :class="classes">
        <button @click="setTheme('dark')">dark</button>
        <button @click="setTheme('light')">light</button>
    </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {useCookie} from 'flue3';

const theme = useCookie('theme', () => 'light');
const setTheme = (value: string) => {
  theme.value = value; // так же изменит куки у пользователя
};

const classes = computed(() => {
  return [`theme--${theme.value}`];
});
</script>
```
