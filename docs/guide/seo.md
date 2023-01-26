# SEO и Meta-теги

Для управления Мета-тегами можно воспользоваться пакетом **@flue3/head** который основан на **@vueuse/head** и **unhead**.

Для подробностей посетите документацию [unhead](https://unhead.harlanzw.com/).

## Установка

`npm`
```
npm install @flue3/head --save
```

`yarn`
```
yarn add @flue3/head
```

Так как **@flue3/head** это плагин, нам нужно его заиницилизировать в `createApp`.

`src/app.ts`
```typescript
import {createApp} from 'flue3';
import {createHeadPlugin} from '@flue3/head';

import App from '@/App.vue';

export default createApp(App, {
    plugins: [
        createHeadPlugin({
            /*
            здесь можно указать объект конфигурации мета-тегов
            который будет применятся по умолчанию на всех страницах
             */
            title: 'My site',
        })
    ],
});
```

## Использование

Для изменения мета-тегов страницы в `setup` функциях можно воспользоваться функцией [useHead](https://unhead.harlanzw.com/guide/guides/usehead).

```vue
<script lang="ts" setup>
import {useHead} from '@flue3/head';

useHead({
    title: 'My Page',
      meta: [{
          name: 'description',
          content: 'My page description',
      }],
});
</script>
```
