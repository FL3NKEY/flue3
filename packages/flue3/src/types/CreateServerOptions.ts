import { createUniversalEntry } from '../app/entryServer.js';
import { NodeMiddleware } from 'h3';
import { SSRManifest } from './SSRManifest.js';
import type { ServerOptions as HTTPProxyOptions } from 'http-proxy';

export interface CreateServerOptions {
    ssr: boolean;
    mode: 'production' | 'development';
    hostname: string;
    port: number;
    ssrEntrypoint?: ReturnType<typeof createUniversalEntry>;
    ssrEntrypointLoader?: () => Promise<ReturnType<typeof createUniversalEntry>>;
    htmlTemplate: ((url: string) => Promise<string>) | string;
    proxies?: Record<string, HTTPProxyOptions | string>;
    middlewares?: NodeMiddleware[];
    manifest?: SSRManifest;
    publicPath?: [string, string];
}
