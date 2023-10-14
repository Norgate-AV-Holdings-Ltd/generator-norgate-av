import { TemplateInterface, TemplateSignature } from "../@types";
import { ClangGenerator } from "./ClangGenerator";
import AppGenerator from "..";

export class GeneratorFactory {
    private static readonly templates = [ClangGenerator];

    public static create(generator: AppGenerator): TemplateInterface {
        const { type } = generator.options;

        const template = this.templates.find(
            ({ signature: { aliases, id } }) => {
                return aliases.indexOf(type) || id === type;
            },
        );

        if (!template) {
            throw new Error(
                `Invalid project type: ${type}\nPossible types are: ${this.templates
                    .map(({ signature: { aliases } }) => aliases.join(", "))
                    .join(", ")}`,
            );
        }

        return new template(generator);
    }

    public static getAvailable(): TemplateSignature[] {
        return this.templates.map(({ signature: { id, name, aliases } }) => {
            return {
                id,
                name,
                aliases,
            };
        });
    }
}

export default GeneratorFactory;
