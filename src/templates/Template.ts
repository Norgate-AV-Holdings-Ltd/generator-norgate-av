export interface Template {
    getName(): string;
    getSourceRoot(): string;
    prompting(): Promise<void>;
    writing(): Promise<void>;
    install(): Promise<void>;
    end(): Promise<void>;
}
