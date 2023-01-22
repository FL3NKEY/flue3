# Компоненты

## AppRoot

Корневой компонент приложения, который вы должны использовать в своём корневом компоненте.

`src/App.vue`
```vue
<template>
    <AppRoot>
        <!-- основной слот -->
        <template #error="errorState">
            <!--
            слот с отображением страницы ошибки
            укажите его для переопределения стандартной страницы ошибки
            -->
            <MyCustomError :error="errorState" />
        </template>
    </AppRoot>
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'
import { AppRoot } from 'flue3';

const MyCustomError = defineAsyncComponent(() => import('./MyCustomError.vue'));
</script>
```

## ClientOnly

Иногда нужно отобразить содержимое и компоненты только на стороне клиента (браузера).
Этот компонент поможет вам в этом.

`src/ExampleComponent.vue`
```vue
<template>
    <div>
        Im hydrate from server
    </div>
    <ClientOnly>
        <div>
            Im displayed only on client
        </div>
        <template #fallback>
            <!-- слот для отображения во время загрузки -->
            loading...
        </template>
    </ClientOnly>
</template>

<script lang="ts" setup>
import { ClientOnly } from 'flue3';
</script>
```
