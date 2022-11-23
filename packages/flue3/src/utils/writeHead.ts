import { NodeServerResponse } from 'h3';

export const writeHead = (res: NodeServerResponse, params: {
    status?: number;
    statusText?: string;
    headers?: Record<any, string | number | string[]>;
} = {}) => {
    if (params.status) {
        res.statusCode = params.status;
    }
    if (params.statusText) {
        res.statusMessage = params.statusText;
    }
    if (params.headers) {
        Object.keys(params.headers).forEach((key) => {
            res.setHeader(key, params.headers![key]);
        });
    }
};
