import { PromptQuestion } from "@yeoman/types";
import { BaseQuestion } from "./BaseQuestion.js";
import { Answers } from "../@types/index.js";
import AppGenerator from "../app.js";

export class ProjectDescription extends BaseQuestion {
    public constructor(generator: AppGenerator) {
        super(generator);

        if (
            this.generator.options.description === undefined &&
            this.generator.options.skipPrompts
        ) {
            this.generator.options.description = this.getDefault();
        }
    }

    private getDefault(): string {
        return "";
    }

    public getQuestion(): PromptQuestion<Answers> {
        return {
            type: "input",
            name: "description",
            message: "What's the description of your project?",
            default: this.getDefault(),
            when:
                !this.generator.options.description &&
                !this.generator.options.skipPrompts,
        };
    }
}
