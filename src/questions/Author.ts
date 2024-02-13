import { PromptQuestion } from "@yeoman/types";
import { BaseQuestion } from "./index.js";
import { Answers } from "../@types/index.js";
import AppGenerator from "../app.js";

export class Author extends BaseQuestion {
    public constructor(generator: AppGenerator) {
        super(generator);
        // this.generator.options.author = this.generator.git.name();
    }

    private getDefault(): string {
        return "";
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
