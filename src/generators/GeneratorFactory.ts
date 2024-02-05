import { GeneratorInterface, GeneratorSignature } from "../@types/index.js";
import { ClangGenerator } from "./index.js";
import AppGenerator from "../app.js";

export class GeneratorFactory {
    static generators = [ClangGenerator];

    public static create(generator: AppGenerator): GeneratorInterface {
        const { type } = generator.options;

        // const Generator = GeneratorFactory.generators.find(
        //     ({ signature: { aliases, id } }) => {
        //         return aliases.indexOf(type) || id === type;
        //     },
        // );
        const Generator = GeneratorFactory.generators.find(
            (generator) =>
                generator.getSignature().aliases.includes(type) ||
                generator.getSignature().id === type,
        );

        if (!Generator) {
            throw new Error(
                `Invalid project type: ${type}\nPossible types are: ${GeneratorFactory.getAvailable()
                    .map(({ aliases }) => aliases.join(", "))
                    .join(", ")}`,
            );
        }

        return new Generator(generator);
    }

    static getAvailable(): Array<GeneratorSignature> {
        console.log("getAvailable");
        const signatures = GeneratorFactory.generators.map((generator) =>
            generator.getSignature(),
        );
        console.log(signatures);
        return signatures;
    }
}
