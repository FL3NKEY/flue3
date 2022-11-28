import { AppContext } from '../../types/AppContext.js';
import { Cookie } from '../../types/Cookie';
import { parseCookie, serializeCookie } from '../../utils/cookie.js';

export const createUniversalCookie = (appContext: AppContext): Cookie => {
    const getResCookies = () => {
        let cookies = appContext?.res?.getHeader('Set-Cookie');
        cookies = typeof cookies === 'string' ? [cookies] : cookies;
        return (cookies || []) as string[];
    };

    const setResCookie = (cookieList: string[]) => appContext?.res?.setHeader('Set-Cookie', cookieList);

    const getParsedCookies = () => {
        if (appContext.isServer) {
            const parsedReqCookies = parseCookie(String(appContext.req?.headers?.cookie));
            const parsedResCookies = parseCookie(getResCookies());

            return {
                ...parsedReqCookies,
                ...parsedResCookies,
            };
        }

        return parseCookie(document.cookie);
    };

    const set: Cookie['set'] = (key, value, options) => {
        if (appContext.isServer) {
            const resCookies = getResCookies();
            resCookies.push(serializeCookie(key, value, options));
            setResCookie(resCookies);
        } else {
            document.cookie = serializeCookie(key, value, options);
        }
    };

    const get: Cookie['get'] = (key) => {
        const parsedCookies = getParsedCookies();
        return parsedCookies[key];
    };

    const has: Cookie['has'] = (key) => {
        const parsedCookies = getParsedCookies();
        return parsedCookies.hasOwnProperty(key);
    };

    const remove: Cookie['remove'] = (key) => {
        set(key, '', {
            Expires: -1,
        });
    };

    return {
        set,
        get,
        has,
        remove,
    };
};
