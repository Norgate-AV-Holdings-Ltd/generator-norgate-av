import { GeneratorInterface, GeneratorSignature } from "../@types/index.js";
import { ClangGenerator } from "./index.js";
import AppGenerator from "../app.js";

export class GeneratorFactory {
    private static readonly generators = [ClangGenerator];

    public static create(generator: AppGenerator): GeneratorInterface {
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

    public static getAvailable(): GeneratorSignature[] {
        return this.generators.map(({ signature: { id, name, aliases } }) => {
            return {
                id,
                name,
                aliases,
            };
        });
    }
}
