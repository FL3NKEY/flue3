import {defineConfig} from 'vitepress';

export default defineConfig({
    appearance: 'dark',
    locales: {
        root: {
            label: 'Русский',
            lang: 'ru',
            head: [
                ['link', { rel: 'icon', href: '/favicon.png', type: 'image/png' }],
            ],
            title: 'flue3',
            description: 'flue3 Web-фреймворк основанный на Vite и Vue 3',
            themeConfig: {
                logo: '/logo-symbol.png',
                nav: [
                    {
                        text: 'Руководство',
                        link: '/guide/',
                        activeMatch: '/guide/'
                    },
                    {
                        text: 'API',
                        link: '/api/',
                        activeMatch: '/api/'
                    },
                ],
                socialLinks: [
                    { icon: 'github', link: 'https://github.com/FL3NKEY/flue3' },
                ],
                footer: {
                    message: `Лицензия MIT. Используй как хочешь. Если хочешь...`,
                    copyright: '2023 - по настоящее время © FL3NKEY',
                },
                sidebar: {
                    '/guide/': [
                        {
                            text: 'Руководство',
                            items: [
                                {
                                    text: 'Введение',
                                    link: '/guide/'
                                },
                                {
                                    text: 'Установка и создание',
                                    link: '/guide/install'
                                },
                                {
                                    text: 'Файл конфигурации',
                                    link: '/guide/config'
                                },
                                {
                                    text: 'Контекст приложения',
                                    link: '/guide/context'
                                },
                                {
                                    text: 'Входные точки приложоения',
                                    link: '/guide/entrypoint'
                                },
                                {
                                    text: 'Асинхронные операции',
                                    link: '/guide/async'
                                },
                                {
                                    text: 'Режимы приложения',
                                    link: '/guide/modes'
                                },
                                {
                                    text: 'Плагины',
                                    link: '/guide/plugins'
                                },
                                {
                                    text: 'Сборка и деплой',
                                    link: '/guide/build-deploy'
                                },
                            ]
                        },
                        {
                            text: 'Возможности',
                            items: [
                                {
                                    text: 'Статические файлы',
                                    link: '/guide/assets'
                                },
                                {
                                    text: 'Фетчинг данных',
                                    link: '/guide/fetching'
                                },
                                {
                                    text: 'Middleware',
                                    link: '/guide/middleware'
                                },
                                {
                                    text: 'Работа с cookie',
                                    link: '/guide/cookie'
                                },
                                {
                                    text: 'Работа со стейтом',
                                    link: '/guide/state'
                                },
                                {
                                    text: 'Обработка ошибок',
                                    link: '/guide/error'
                                },
                                {
                                    text: 'Перенаправление навигации',
                                    link: '/guide/redirect'
                                },
                            ]
                        },
                        {
                            text: 'Готовые решения',
                            items: [
                                {
                                    text: 'Роутинг и страницы',
                                    link: '/guide/routing'
                                },
                                {
                                    text: 'Глобальное хранилище',
                                    link: '/guide/store'
                                },
                                {
                                    text: 'SEO и Meta-теги',
                                    link: '/guide/seo'
                                },
                            ]
                        }
                    ],
                    '/api/': [
                        {
                            text: 'API',
                            items: [
                                {
                                    text: 'Приложение',
                                    link: '/api/',
                                },
                                {
                                    text: 'Контекст',
                                    link: '/api/context',
                                },
                                {
                                    text: 'Компоненты',
                                    link: '/api/components',
                                },
                                {
                                    text: 'Composable функции',
                                    link: '/api/composables',
                                },
                                {
                                    text: 'Плагины',
                                    link: '/api/plugins',
                                }
                            ]
                        }
                    ],
                }
            },
        },
        en: {
            label: 'English',
            lang: 'en',
            head: [
                ['link', { rel: 'icon', href: '/favicon.png', type: 'image/png' }],
            ],
            title: 'flue3',
            description: 'flue3 Web-framework based on Vite и Vue 3',
            themeConfig: {
                logo: '/logo-symbol.png',
                nav: [
                    {
                        text: 'Guide',
                        link: '/guide/',
                        activeMatch: '/guide/'
                    },
                    {
                        text: 'API',
                        link: '/api/',
                        activeMatch: '/api/'
                    },
                ],
                socialLinks: [
                    {icon: 'github', link: 'https://github.com/FL3NKEY/flue3'},
                ],
                footer: {
                    message: `MIT.`,
                    copyright: '2023 - today © FL3NKEY',
                },
            },
        }
    },
});
