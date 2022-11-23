import { AppContext } from '../../types/AppContext.js';

export const implementClientInitialState = (appContext: AppContext) => {
    // eslint-disable-next-line no-underscore-dangle,no-param-reassign
    appContext.initialState = (window as any)._FLUE3_INITIAL_STATE;
};
