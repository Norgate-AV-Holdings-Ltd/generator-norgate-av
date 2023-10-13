import { Template, TemplateId } from "../templates";
import { ClangTemplate } from "./ClangTemplate";
import AppGenerator from "..";

export class TemplateFactory {
    private static readonly templates = [ClangTemplate];

    public static createTemplate(generator: AppGenerator): Template {
        const { type } = generator.options;

        const template = this.templates.find(({ aliases, id }) => {
            return aliases.indexOf(type) || id === type;
        });

        if (!template) {
            throw new Error(
                `Invalid project type: ${type}\nPossible types are: ${this.templates
                    .map(({ aliases }) => aliases.join(", "))
                    .join(", ")}`,
            );
        }

        return new template(generator);
    }

    public static getAvailableTemplates(): TemplateId[] {
        return this.templates.map(({ id, name, aliases }) => {
            return {
                id,
                name,
                aliases,
            };
        });
    }
}

export default TemplateFactory;
