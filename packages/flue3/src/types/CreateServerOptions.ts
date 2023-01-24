import { createUniversalEntry } from '../app/entryServer.js';
import { NodeMiddleware } from 'h3';
import { SSRManifest } from './SSRManifest.js';
import type { ServerOptions as HTTPProxyOptions } from 'http-proxy';
import { ViteDevServer } from 'vite';

export interface CreateServerOptions {
    ssr: boolean;
    mode: 'production' | 'development';
    basePath: string;
    hostname: string;
    port: number;
    ssrEntrypoint?: ReturnType<typeof createUniversalEntry>;
    ssrEntrypointLoader?: () => Promise<ReturnType<typeof createUniversalEntry>>;
    htmlTemplate: ((url: string) => Promise<string>) | string;
    proxies?: Record<string, HTTPProxyOptions | string>;
    middlewares?: NodeMiddleware[];
    manifest?: SSRManifest;
    publicPath?: [string, string];
    vite?: ViteDevServer;
    entrypointFilePath?: string;
}
