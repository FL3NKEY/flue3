import { AppContext } from '../../types/AppContext.js';
import { createUniversalCookie } from './createUniversalCookie.js';

export const implementCookie = (appContext: AppContext) => {
    const cookie = createUniversalCookie(appContext);

    appContext.inject('setCookie', cookie.set, true);
    appContext.inject('getCookie', cookie.get, true);
    appContext.inject('hasCookie', cookie.has, true);
    appContext.inject('removeCookie', cookie.remove, true);
};
