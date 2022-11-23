import { createApp } from 'flue3';
import { createHeadPlugin } from '@flue3/head';
import App from './app.vue';

export default createApp(App, {
    plugins: [createHeadPlugin({
        title: 'hello world here',
    })],
});
