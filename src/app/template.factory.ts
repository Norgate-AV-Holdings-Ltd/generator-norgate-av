import Generator, { GeneratorOptions } from "yeoman-generator";
import Template, { TemplateId } from "./template.interface";
import ClangTemplate from "./clang.template";

class TemplateFactory {
    private static readonly templates = [ClangTemplate];

    public static createTemplate(
        id: string,
        { generator, options }: { generator: Generator; options: GeneratorOptions },
    ): Template {
        const template = this.templates.find((template) => {
            return template.aliases.includes(id) || template.id === id;
        });

        if (!template) {
            throw new Error(`No template found with id ${id}`);
        }

        return new template(generator, options);
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
