import GeneratorSignature from "./GeneratorSignature";

interface GeneratorInterface {
    getSignature(): GeneratorSignature;
    getSourceRoot(): string;
    prompting(): Promise<void>;
    writing(): Promise<void>;
    install(): Promise<void>;
    end(): Promise<void>;
}

export default GeneratorInterface;
