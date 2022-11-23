import { AppContext } from './AppContext.js';
import { SSRTemplatePartials } from './SSRTemplatePartials.js';

export interface FrameworkContext {
    appContext: AppContext;
    teleports?: SSRTemplatePartials['teleports'];
    modules: Set<string>;
}
