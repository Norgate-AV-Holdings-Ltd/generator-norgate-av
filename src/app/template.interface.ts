export interface Template {
    getName(): string;
    prompting(): Promise<void>;
    writing(): Promise<void>;
    install(): Promise<void>;
    end(): Promise<void>;
}

export interface TemplateId {
    id: string;
    name: string;
    aliases: string[];
}

export default Template;
