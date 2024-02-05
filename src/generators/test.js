import Generator from "yeoman-generator";
import config from "config";

class ClangGenerator {
    generator;

    constructor(generator) {
        this.generator = generator;
    }

    static getSignature() {
        return config.get("generators.c.signature");
    }
}

class TypescriptGenerator {
    generator;

    constructor(generator) {
        this.generator = generator;
    }

    static getSignature() {
        return config.get("generators.ts.signature");
    }
}

class GeneratorFactory {
    static generators = [ClangGenerator, TypescriptGenerator];
    static create(generator) {
        const { type } = generator.options;

        const Generator = this.generators.find(
            ({ signature: { aliases, id } }) => {
                return aliases.indexOf(type) || id === type;
            },
        );

        if (!Generator) {
            throw new Error(
                `Invalid project type: ${type}\nPossible types are: ${this.generators
                    .map(({ signature: { aliases } }) => aliases.join(", "))
                    .join(", ")}`,
            );
        }

        return new Generator(generator);
    }

    static getAvailable() {
        return GeneratorFactory.generators.map((generator) =>
            generator.getSignature(),
        );
    }
}

class MyGenerator extends Generator {
    prompting() {
        this.log("Prompting");

        for (const generator of GeneratorFactory.getAvailable()) {
            this.log(generator);
        }
    }
}

export default MyGenerator;
