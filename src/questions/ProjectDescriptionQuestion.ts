import { Question } from "yeoman-generator";
import AppGenerator from "..";
import { TemplateQuestion } from ".";

export class ProjectDescriptionQuestion extends TemplateQuestion {
    constructor(generator: AppGenerator) {
        super(generator);
    }

    public getQuestion(): Question<{ description: string }> {
        return {
            type: "input",
            name: "description",
            message: "What's the description of your project?",
            default: "",
            when:
                !this.generator.options.description &&
                !this.generator.options.skipPrompts,
        };
    }
}
