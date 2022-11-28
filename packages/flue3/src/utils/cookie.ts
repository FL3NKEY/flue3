import {
    CookieOptions,
    CookieValue,
    ParsedCookie,
    RawCookie,
} from '../types/Cookie.js';

export const parseCookie = (rawCookie: RawCookie | RawCookie[]): ParsedCookie => {
    if (!rawCookie) {
        return {};
    }

    let currentRawCookie = '';

    if (Array.isArray(rawCookie)) {
        currentRawCookie = rawCookie.length
            ? rawCookie.map((rawCookieItem) => rawCookieItem.split(';')[0]).join(';')
            : '';
    } else {
        currentRawCookie = rawCookie;
    }

    return currentRawCookie
        .split(';')
        .map((splitItems) => splitItems.split('='))
        .reduce<ParsedCookie>((parsedCookie, splitValues) => {
        const key = decodeURIComponent(splitValues[0]?.trim());
        let value: CookieValue = decodeURIComponent(splitValues[1]?.trim());

        if (key && value) {
            if (value === 'true') value = true;
            else if (value === 'false') value = false;
            else if (!isNaN(parseFloat(value))) value = parseFloat(value);

            // eslint-disable-next-line no-param-reassign
            parsedCookie[key] = value;
        }

        return parsedCookie;
    }, {});
};

export const stringifyCookie = (parsedCookie: ParsedCookie) => {
    return Object.keys(parsedCookie)
        .map((key) => `${key}=${parsedCookie[key]}`)
        .join('; ');
};

export const serializeCookie = (key: string, value: CookieValue, options?: CookieOptions): string => {
    let serializedCookie = `${key}=${value}`;

    if (options) {
        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (const key in options) {
            serializedCookie += '; ' + key;
            const optionValue = options[key as keyof CookieOptions];
            if (optionValue !== true) {
                serializedCookie += `=${optionValue}`;
            }
        }
    }

    return serializedCookie;
};
