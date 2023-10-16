import { GeneratorInterface, GeneratorSignature } from "../@types";
import ClangGenerator from "./ClangGenerator";
import AppGenerator from "..";

class GeneratorFactory {
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

export default GeneratorFactory;
