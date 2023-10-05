import Generator, { GeneratorOptions } from "yeoman-generator";
import Template from "./Template";

class ClangTemplate implements Template {
    public static id: string = "template-c";
    public static aliases: string[] = ["c", "clang"];
    public static name: string = "C";

    async prompting(generator: Generator, config: GeneratorOptions): Promise<void> {}

    async writing(generator: Generator, config: GeneratorOptions): Promise<void> {}

    async install(generator: Generator, config: GeneratorOptions): Promise<void> {}

    async end(generator: Generator, config: GeneratorOptions): Promise<void> {}
}

export default ClangTemplate;
