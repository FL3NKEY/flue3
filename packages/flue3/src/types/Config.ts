import { DeepPartial } from './DeepPartial.js';

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
    };
}

export type ConfigDraft = DeepPartial<Config>;
