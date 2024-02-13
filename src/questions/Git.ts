import { PromptQuestion } from "@yeoman/types";
import { BaseQuestion } from "./index.js";
import { Answers } from "../@types/index.js";
import AppGenerator from "../app.js";

export class Git extends BaseQuestion {
    public constructor(generator: AppGenerator) {
        super(generator);

        if (this.generator.options.git === false) {
            return;
        }

        if (this.generator.options.skipPrompts) {
            this.generator.options.git = this.getDefault();
        }
    }

    private getDefault(): boolean {
        return true;
    }

    public getQuestion(): PromptQuestion<Answers> {
        return {
            type: "confirm",
            name: "git",
            message: "Initialize a git repository?",
            default: this.getDefault(),
            when:
                this.generator.options.git === undefined &&
                !this.generator.options.skipPrompts,
        };
    }
}
