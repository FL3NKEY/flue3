// fetch-polyfill.js
import fetch, {
    Headers,
    Request,
    Response,
    RequestInit,
    RequestInfo,
} from 'node-fetch';

export const implementFetchPolyfill = (
    {
        hostname,
        port,
    }: {
        hostname: string;
        port: number;
    },
) => {
    if (!globalThis.fetch) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        globalThis.fetch = (url: RequestInfo, init: RequestInit): Promise<Response> => {
            const isFullUrl = /^http(s?):\/\//.test(url as string);
            const currentUrl = isFullUrl ? url : `http://${hostname}:${port}${url}`;
            return fetch(currentUrl, init);
        };
        globalThis.Headers = Headers;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        globalThis.Request = Request;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        globalThis.Response = Response;
    }
};
