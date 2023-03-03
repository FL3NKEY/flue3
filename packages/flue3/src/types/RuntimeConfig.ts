import { Config } from './Config.js';

export type RuntimeConfig = Pick<Config, 'server' | 'basePath' | 'appConfig'>
