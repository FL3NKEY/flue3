export type CookieValue = string | number | boolean | undefined;

export type ParsedCookie = Record<string, CookieValue>;

export type RawCookie = string;

export interface CookieOptions {
    Expires?: Date| number | string;
    'Max-Age'?: Date| number | string;
    Path?: string;
    Domain?: string;
    Secure?: boolean;
    SameSite?: 'lax' | 'strict' | 'none';
}

export interface Cookie {
    set: (key: string, value: CookieValue, options?: CookieOptions) => void;
    get: (key: string) => CookieValue;
    has: (key: string) => boolean;
    remove: (key: string) => void;
}
