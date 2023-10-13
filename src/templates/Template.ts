export interface Template {
    getSignature(): { id: string; name: string; aliases: string[] };
    getSourceRoot(): string;
    prompting(): Promise<void>;
    writing(): Promise<void>;
    install(): Promise<void>;
    end(): Promise<void>;
}
