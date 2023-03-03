import fetch, {
    Response,
    RequestInit,
    RequestInfo,
    Headers,
    Request,
} from 'node-fetch';

export const implementFetchPolyfill = () => {
    if (!globalThis.fetch) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        globalThis.fetch = fetch;
        globalThis.Headers = Headers;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        globalThis.Request = Request;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        globalThis.Response = Response;
    }
};

export const implementPreparedFetchPolyfill = (
    {
        hostname,
        port,
    }: {
        hostname: string;
        port: number;
    },
) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    if (!globalThis.__fetchPolyfilled) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        globalThis.fetch = (url: RequestInfo, init: RequestInit): Promise<Response> => {
            const isFullUrl = /^http(s?):\/\//.test(url as string);
            const currentUrl = isFullUrl ? url : `http://${hostname}:${port}${url}`;
            return fetch(currentUrl, init);
        };

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line no-underscore-dangle
        globalThis.__fetchPolyfilled = true;
    }
};
