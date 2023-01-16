import { serializeError } from 'serialize-error';

type RawError = number | string | Record<any, any> | Error;
interface ParsedError extends Record<string, any> {
    status: number;
    message: string;
    stack: string;
}

export const isAppError = (err: any) => err && typeof err === 'object' && '$isAppError' in err;
export const createError = (err: RawError): ParsedError => {
    let status = 500;
    let message = '';
    let stack = '';

    if (typeof err === 'number') {
        status = err;
    } else if (typeof err === 'string') {
        message = err;
    } else if (err instanceof Error) {
        const serializedErr = serializeError(err);
        message = serializedErr.message ?? message;
        stack = serializedErr.stack ?? stack;
    } else if (typeof err === 'object') {
        status = err?.status ?? err?.statusCode ?? status;
        message = err?.message ?? err?.statusText ?? message;
    }

    if (!stack) {
        stack = new Error(message).stack ?? '';
    }

    return {
        status,
        message,
        stack,
        $isAppError: true,
    };
};

export const isRedirectError = (err: any) => err && typeof err === 'object' && '$isAppError' in err;
export const createRedirectError = (status = 302): ParsedError => {
    return {
        ...createError(status),
        $isRedirectError: true,
    };
};

export const parseError = (err: any): ParsedError => {
    if (!isAppError(err)) {
        return createError(err);
    }

    return err;
};
