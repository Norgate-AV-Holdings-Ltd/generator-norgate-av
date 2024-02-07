import { GeneratorInterface, GeneratorSignature } from "../@types/index.js";
import {
    ClangGenerator,
    CrestronSimplGenerator,
    HtmlGenerator,
    JavascriptGenerator,
    NodeCliGenerator,
    PythonGenerator,
    TypescriptGenerator,
} from "./index.js";
import AppGenerator from "../app.js";

export class GeneratorFactory {
    public static generators = [
        TypescriptGenerator,
        JavascriptGenerator,
        NodeCliGenerator,
        PythonGenerator,
        CrestronSimplGenerator,
        HtmlGenerator,
        ClangGenerator,
    ];

    public static create(generator: AppGenerator): GeneratorInterface {
        const { type } = generator.options;

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

    public static getAvailable(): Array<GeneratorSignature> {
        return GeneratorFactory.generators.map((generator) =>
            generator.getSignature(),
        );
    }
}
