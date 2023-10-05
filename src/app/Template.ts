import Generator, { GeneratorOptions } from "yeoman-generator";

interface Template {
    prompting(generator: Generator, config: GeneratorOptions): Promise<void>;
    writing(generator: Generator, config: GeneratorOptions): Promise<void>;
    install(generator: Generator, config: GeneratorOptions): Promise<void>;
    end(generator: Generator, config: GeneratorOptions): Promise<void>;
}

export default Template;
