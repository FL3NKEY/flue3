export interface FetchState<T> {
    serverPrefetched: boolean;
    data: T;
    pending: boolean;
    error: any;
}
