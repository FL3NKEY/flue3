import { DeepPartial } from './DeepPartial.js';
import type { ServerOptions as HTTPProxyOptions } from 'http-proxy';

export interface Config {
    appId: string;
    entryFilename: string;
    srcPath: string;
    outputPath: string;
    mode: 'production' | 'development';
    ssr: boolean;
    exclude: Array<string>;
    server: {
        hostname: string;
        port: number;
        proxies: Record<string, HTTPProxyOptions | string>;
    };
}

export type ConfigDraft = DeepPartial<Config>;
