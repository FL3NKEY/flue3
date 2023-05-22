import { DeepPartial } from './DeepPartial.js';
import type { ServerOptions as HTTPProxyOptions } from 'http-proxy';
import { Plugin } from 'vite';
import { AppConfig } from './AppConfig.js';

interface ServerMiddlewareRecord {
    path: string;
    handler: string;
}

export interface Config {
    appId: string;
    basePath: string;
    entryFilename: string;
    entryClientFilename: string;
    entryServerFilename: string;
    loadingTemplateFilename: string | false;
    headTemplateFilename: string | false;
    srcPath: string;
    outputPath: string;
    mode: 'production' | 'development';
    ssr: boolean;
    excludeDeps: Array<string>;
    minify: boolean;
    aliases: Record<string, string>;
    server: {
        hostname: string;
        port: number;
        proxies: Record<string, HTTPProxyOptions | string>;
        middleware: ServerMiddlewareRecord[];
        plugins: string[];
    };
    appConfig: AppConfig;
    vite: {
        plugins: Plugin[];
    };
}

export type ConfigDraft = DeepPartial<Config>;
