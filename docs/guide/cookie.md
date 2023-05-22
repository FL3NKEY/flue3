# Работа с cookie

На сервере не доступен `document.cookie`, поэтому в нём нужен другой подход (работа с HTTP заголовками). **flue3** предоставляет свою обёртку для работы с куки, которая обратаывает оба случая (клиентский и серверный).

Контекст приложения имеет методы [setCookie](/api/context#setcookie), [getCookie](/api/context#getcookie), [hasCookie](/api/context#hascookie) и [removeCookie](/api/context#removecookie) для работы с куки.

`src/plugins/examplePlugin.ts`;
```typescript
import {definePlugin, useAppContext} from 'flue3';

export const createExamplePlugin = definePlugin(() => {
    const {hasCookie, getCookie, setCookie, removeCookie} = useAppContext();
    
    // false
    console.log(hasCookie('theme'));
    // undefined
    console.log(getCookie('theme'));

    setCookie('theme', 'dark');

    // true
    console.log(hasCookie('theme'));
    // 'dark'
    console.log(getCookie('theme'));
    
    removeCookie('theme');
});
```

Так же можно воспользоваться функцией [useCookie](/api/composables#usecookie), который создаёт двухсторонний биндинг значения с куки-файлом.

`src/plugins/examplePlugin.ts`;
```typescript
import {definePlugin, useCookie} from 'flue3';

export const createExamplePlugin = definePlugin(() => {
    const theme = useCookie('theme', () => 'light');
    const isDark = theme.value === 'dark';
    
    if(isDark) {
        theme.value = 'light';
    } else {
        theme.value = 'dark';
    }
});
```

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

const theme = useCookie('theme');
const setTheme = (value: string) => {
  theme.value = value;
};

const classes = computed(() => {
  return [`theme--${theme.value}`];
});
</script>
```
