import { AppContext } from './AppContext.js';
import { SSRTemplatePartials } from './SSRTemplatePartials.js';

export interface FrameworkContext {
    appContext: AppContext;
    ssrContext: {
        teleports?: SSRTemplatePartials['teleports'];
        modules: Set<string>;
    };
}
