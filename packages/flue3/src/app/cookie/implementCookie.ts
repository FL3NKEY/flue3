import { AppContext } from '../../types/AppContext.js';
import { createUniversalCookie } from './createUniversalCookie.js';

export const implementCookie = (appContext: AppContext) => {
    const cookie = createUniversalCookie(appContext);

    appContext.inject('setCookie', cookie.set);
    appContext.inject('getCookie', cookie.get);
    appContext.inject('hasCookie', cookie.has);
    appContext.inject('removeCookie', cookie.remove);
};
