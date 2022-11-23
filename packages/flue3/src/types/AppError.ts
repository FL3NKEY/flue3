export type AppError = (options: {status: number; message?: any} | number) => void;

export interface AppErrorState {
    status: number;
    message: any;
    captured: boolean;
}
