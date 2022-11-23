export interface AppResponse {
    status?: number;
    statusText?: string;
    headers?: Record<string, string | number | string[]>;
}

export type AppWriteResponse = (response: AppResponse) => void;
