import { DeepPartial } from './DeepPartial.js';
import type { ServerOptions as HTTPProxyOptions } from 'http-proxy';

export interface Config {
    appId: string;
    basePath: string;
    entryFilename: string;
    entryClientFilename: string;
    entryServerFilename: string;
    loadingTemplateFilename: string | false;
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
    };
}

export type ConfigDraft = DeepPartial<Config>;
