import { PromptQuestion } from "@yeoman/types";
import { BaseQuestion } from "./BaseQuestion.js";
import { Answers, GeneratorSignature } from "../@types/index.js";
import AppGenerator from "../app.js";

export class ProjectType extends BaseQuestion {
    private readonly choices: Array<GeneratorSignature>;

    public constructor(
        generator: AppGenerator,
        choices: Array<GeneratorSignature>,
    ) {
        super(generator);
        this.choices = choices;
    }

    public getQuestion(): PromptQuestion<Answers> {
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
