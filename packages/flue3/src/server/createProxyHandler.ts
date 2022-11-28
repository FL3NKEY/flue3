import { eventHandler, H3Event } from 'h3';
import httpProxy, { ServerOptions as HTTPProxyOptions } from 'http-proxy';

export const createProxyHandler = (options: HTTPProxyOptions | string) => {
    let currentOptions: HTTPProxyOptions;

    if (typeof options === 'string') {
        // eslint-disable-next-line no-param-reassign
        currentOptions = {
            target: options,
        };
    } else {
        currentOptions = options;
    }

    const proxy = httpProxy.createProxy();

    return eventHandler((event: H3Event) => {
        return new Promise<void>((resolve, reject) => {
            proxy.web(event.node.req, event.node.res, currentOptions, (error: any) => {
                if (error.code !== 'ECONNRESET') {
                    reject(error);
                }

                resolve();
            });
        });
    });
};
