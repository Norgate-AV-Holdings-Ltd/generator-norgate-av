import { Question } from "yeoman-generator";
import AppGenerator from "..";
import { ProjectQuestion } from "./ProjectQuestion";
import { TemplateId } from "../templates";

export class ProjectTypeQuestion extends ProjectQuestion {
    private readonly choices: TemplateId[];

    constructor(generator: AppGenerator, choices: TemplateId[]) {
        super(generator);
        this.choices = choices;
    }

    public getQuestion(): Question<{ type: string }> {
        return {
            type: "list",
            name: "type",
            message: "What type of project do you want to create?",
            pageSize: this.choices.length,
            choices: this.choices.map((type) => {
                return {
                    name: type.name,
                    value: type.id,
                };
            }),
            when: !this.generator.options.type,
        };
    }
}
