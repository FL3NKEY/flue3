import { Config } from '../types/Config';

export const defaultConfig: Config = {
    appId: '__flue3',
    entryFilename: './app',
    entryClientFilename: './entryClient',
    entryServerFilename: './entryServer',
    loadingTemplateFilename: false,
    srcPath: 'src',
    outputPath: 'dist',
    mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
    ssr: true,
    exclude: [],
    server: {
        hostname: '0.0.0.0',
        port: 3000,
        proxies: {},
    },
};
