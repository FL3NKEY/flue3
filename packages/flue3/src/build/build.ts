import { build as viteBuild } from 'vite';
import { resolveConfig } from '../config/resolveConfig.js';
import { createViteConfigFactory } from '../vite/createViteConfig.js';
import { Config } from '../types/Config.js';

export const build = async (configOverwrites?: Config) => {
    const config = resolveConfig(configOverwrites);
    const viteConfigFactory = createViteConfigFactory(config);

    if (config.ssr) {
        await viteBuild(viteConfigFactory('server'));
    }

    await viteBuild(viteConfigFactory('client'));
};
