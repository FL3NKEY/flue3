import { SSRTemplatePartials } from './SSRTemplatePartials';

export interface SSRContext {
    teleports?: SSRTemplatePartials['teleports'];
    modules: Set<string>;
}
