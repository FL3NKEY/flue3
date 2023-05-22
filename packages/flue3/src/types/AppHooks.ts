import { SSRTemplatePartials } from './SSRTemplatePartials.js';

export interface AppHooks {
    'app:created': () => Promise<void> | void;
    'render:before': (renderPartials: SSRTemplatePartials) => Promise<void> | void;
    'render:after': (renderPartials: SSRTemplatePartials) => Promise<void> | void;
    'render:template': (template: string) => Promise<void> | void;
    'entry:after': () => Promise<void> | void;
}
