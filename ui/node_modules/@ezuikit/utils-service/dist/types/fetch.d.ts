export interface Response<T, E = undefined> {
    code: number | string;
    data: T;
    msg: string;
    ext?: E;
    [key: string]: any;
}
export default function <T, E = undefined>(input: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response<T, E>>;
