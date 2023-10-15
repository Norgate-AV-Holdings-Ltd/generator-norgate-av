import { Question } from "yeoman-generator";
import { Answers, GeneratorSignature } from "../@types";
import BaseQuestion from "./BaseQuestion";
import AppGenerator from "..";

class ProjectType extends BaseQuestion {
    private readonly choices: GeneratorSignature[];

    constructor(generator: AppGenerator, choices: GeneratorSignature[]) {
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

export default ProjectType;
