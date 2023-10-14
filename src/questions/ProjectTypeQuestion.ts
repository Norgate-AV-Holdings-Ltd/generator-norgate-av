import { Question } from "yeoman-generator";
import { Answers, TemplateSignature } from "../@types";
import BaseQuestion from "./BaseQuestion";
import AppGenerator from "..";

class ProjectTypeQuestion extends BaseQuestion {
    private readonly choices: TemplateSignature[];

    constructor(generator: AppGenerator, choices: TemplateSignature[]) {
        super(generator);
        this.choices = choices;
    }

    public getQuestion(): Question<Answers> {
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

export default ProjectTypeQuestion;
