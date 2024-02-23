import { PromptQuestion } from "@yeoman/types";
import { BaseQuestion } from "./BaseQuestion.js";
import { Answers } from "../@types/index.js";
import AppGenerator from "../app.js";

export class Author extends BaseQuestion {
    public constructor(generator: AppGenerator) {
        super(generator);

        if (this.generator.options.author) {
            return;
        }

        if (this.generator.options.skipPrompts) {
            this.generator.options.author = this.getDefault();
        }
    }

    private getDefault(): string {
        return this.generator.user || "";
    }

    public getQuestion(): PromptQuestion<Answers> {
        return {
            type: "input",
            name: "author",
            message: "Who's the author of this project?",
            default: this.getDefault(),
            when:
                !this.generator.options.author &&
                !this.generator.options.skipPrompts,
        };
    }
}
