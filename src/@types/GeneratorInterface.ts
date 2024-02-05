export interface GeneratorInterface {
    getSourceRoot(): string;
    initializing(): Promise<void>;
    prompting(): Promise<void>;
    writing(): Promise<void>;
    install(): Promise<void>;
    end(): Promise<void>;
}
