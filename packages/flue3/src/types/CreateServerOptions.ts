import { createUniversalEntry } from '../app/entryServer.js';
import { NodeMiddleware } from 'h3';
import { SSRManifest } from './SSRManifest.js';

export interface CreateServerOptions {
    ssr: boolean;
    mode: 'production' | 'development';
    hostname: string;
    port: number;
    ssrEntrypoint: (url: string) =>
    Promise<ReturnType<typeof createUniversalEntry>> |
    ReturnType<typeof createUniversalEntry>;
    htmlTemplate: ((url: string) => Promise<string>) | string;
    proxies?: any;
    middlewares?: NodeMiddleware[];
    manifest?: SSRManifest;
    publicPath?: [string, string];
}
