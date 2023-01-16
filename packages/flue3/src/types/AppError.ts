export type AppError = (err: any) => void;

export interface AppErrorState {
    status: number;
    message: string;
    stack: string;
    captured: boolean;
}
