import { SSRTemplatePartials } from './SSRTemplatePartials.js';
import { AppContext } from './AppContext.js';

export interface SSRRenderReturns extends SSRTemplatePartials {
    initialState?: AppContext['initialState'];
}
