export type NodeVersion = {
    version: string;
    date: string;
    files: Array<string>;
    npm: string;
    v8: string;
    uv: string;
    zlib: string;
    openssl: string;
    modules: string;
    lts: false | string;
    security: boolean;
};
