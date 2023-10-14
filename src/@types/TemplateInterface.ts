import TemplateSignature from "./TemplateSignature";

interface TemplateInterface {
    getSignature(): TemplateSignature;
    getSourceRoot(): string;
    prompting(): Promise<void>;
    writing(): Promise<void>;
    install(): Promise<void>;
    end(): Promise<void>;
}

export default TemplateInterface;
